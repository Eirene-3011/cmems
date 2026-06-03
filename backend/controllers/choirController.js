const { pool }        = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.coordinator_id, c.status,
              c.created_at, c.updated_at,
              (SELECT CONCAT(m.first_name,' ',m.last_name)
               FROM members m WHERE m.id = c.coordinator_id) AS coordinator_name,
              (SELECT COUNT(DISTINCT cm.member_id)
               FROM choir_members cm
               WHERE cm.choir_id = c.id AND cm.status = 'Active') AS member_count
       FROM choirs c
       ORDER BY c.name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.coordinator_id, c.status,
              c.created_at, c.updated_at,
              (SELECT CONCAT(m.first_name,' ',m.last_name)
               FROM members m WHERE m.id = c.coordinator_id) AS coordinator_name
       FROM choirs c
       WHERE c.id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Choir not found.' });

    const [members] = await pool.execute(
      `SELECT me.id, me.first_name, me.last_name, cm.voice_part, cm.date_joined
       FROM choir_members cm
       JOIN members me ON me.id = cm.member_id
       WHERE cm.choir_id = ? AND cm.status = 'Active'
       ORDER BY me.last_name`, [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], members } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, description, coordinator_id, status = 'Active' } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });
    const [result] = await pool.execute(
      'INSERT INTO choirs (name, description, coordinator_id, status) VALUES (?, ?, ?, ?)',
      [name, description || null, coordinator_id || null, status]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'choirs', recordId: result.insertId, description: `Created choir: ${name}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Choir created.', id: result.insertId });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { name, description, coordinator_id, status } = req.body;
    const [existing] = await pool.execute('SELECT id FROM choirs WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Choir not found.' });
    await pool.execute(
      'UPDATE choirs SET name=?, description=?, coordinator_id=?, status=? WHERE id=?',
      [name, description || null, coordinator_id || null, status, req.params.id]
    );
    await logActivity({ userId: req.user.id, action: 'UPDATE', tableName: 'choirs', recordId: req.params.id, description: `Updated choir id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Choir updated.' });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await pool.execute('DELETE FROM choirs WHERE id = ?', [req.params.id]);
    await logActivity({ userId: req.user.id, action: 'DELETE', tableName: 'choirs', recordId: req.params.id, description: `Deleted choir id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Choir deleted.' });
  } catch (err) { next(err); }
}

async function addMember(req, res, next) {
  try {
    const { member_id, voice_part } = req.body;
    await pool.execute(
      `INSERT INTO choir_members (choir_id, member_id, voice_part)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status='Active', voice_part=VALUES(voice_part)`,
      [req.params.id, member_id, voice_part || null]
    );
    res.json({ success: true, message: 'Member added to choir.' });
  } catch (err) { next(err); }
}

async function removeMember(req, res, next) {
  try {
    await pool.execute(
      `UPDATE choir_members SET status='Inactive' WHERE choir_id=? AND member_id=?`,
      [req.params.id, req.params.memberId]
    );
    res.json({ success: true, message: 'Member removed from choir.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove, addMember, removeMember };
