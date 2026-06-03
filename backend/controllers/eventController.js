const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const { status, type } = req.query;
    let sql = `SELECT e.*, CONCAT(u.first_name,' ',u.last_name) AS created_by_name
               FROM events e LEFT JOIN users u ON u.id = e.created_by WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND e.status = ?'; params.push(status); }
    if (type)   { sql += ' AND e.event_type = ?'; params.push(type); }
    sql += ' ORDER BY e.start_date DESC';
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, CONCAT(u.first_name,' ',u.last_name) AS created_by_name
       FROM events e LEFT JOIN users u ON u.id = e.created_by WHERE e.id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Event not found.' });

    const [registrations] = await pool.execute(
      `SELECT er.*, CONCAT(m.first_name,' ',m.last_name) AS member_name
       FROM event_registrations er JOIN members m ON m.id = er.member_id
       WHERE er.event_id = ? ORDER BY m.last_name`, [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], registrations } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, description, event_type, venue, start_date, end_date, capacity, status = 'Upcoming' } = req.body;
    if (!title || !event_type || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'title, event_type, start_date, end_date are required.' });
    }
    const [result] = await pool.execute(
      `INSERT INTO events (title, description, event_type, venue, start_date, end_date, capacity, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, event_type, venue || null, start_date, end_date, capacity || null, status, req.user.id]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'events', recordId: result.insertId, description: `Created event: ${title}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Event created.', id: result.insertId });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { title, description, event_type, venue, start_date, end_date, capacity, status } = req.body;
    const [existing] = await pool.execute('SELECT id FROM events WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Event not found.' });
    await pool.execute(
      `UPDATE events SET title=?, description=?, event_type=?, venue=?, start_date=?, end_date=?, capacity=?, status=? WHERE id=?`,
      [title, description || null, event_type, venue || null, start_date, end_date, capacity || null, status, req.params.id]
    );
    await logActivity({ userId: req.user.id, action: 'UPDATE', tableName: 'events', recordId: req.params.id, description: `Updated event id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Event updated.' });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await pool.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
    await logActivity({ userId: req.user.id, action: 'DELETE', tableName: 'events', recordId: req.params.id, description: `Deleted event id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) { next(err); }
}

async function register(req, res, next) {
  try {
    const { member_id } = req.body;
    const [event] = await pool.execute('SELECT id, capacity FROM events WHERE id = ?', [req.params.id]);
    if (!event.length) return res.status(404).json({ success: false, message: 'Event not found.' });

    const [regCount] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM event_registrations WHERE event_id = ? AND status = 'Registered'`, [req.params.id]
    );
    if (event[0].capacity && regCount[0].cnt >= event[0].capacity) {
      return res.status(409).json({ success: false, message: 'Event is at full capacity.' });
    }
    await pool.execute(
      `INSERT INTO event_registrations (event_id, member_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE status='Registered'`,
      [req.params.id, member_id]
    );
    res.json({ success: true, message: 'Registered for event.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove, register };
