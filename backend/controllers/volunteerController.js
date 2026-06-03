const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT v.*, CONCAT(m.first_name,' ',m.last_name) AS member_name, m.contact_number, m.email
       FROM volunteers v JOIN members m ON m.id = v.member_id
       WHERE v.status = 'Active' ORDER BY m.last_name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { member_id, skills, availability } = req.body;
    if (!member_id) return res.status(400).json({ success: false, message: 'member_id is required.' });
    const [result] = await pool.execute(
      `INSERT INTO volunteers (member_id, skills, availability)
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status='Active', skills=VALUES(skills), availability=VALUES(availability)`,
      [member_id, skills || null, availability || null]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'volunteers', recordId: result.insertId, description: `Registered volunteer member_id ${member_id}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Volunteer registered.', id: result.insertId });
  } catch (err) { next(err); }
}

async function getAssignments(req, res, next) {
  try {
    const { volunteer_id, event_id } = req.query;
    let sql = `SELECT va.*, CONCAT(m.first_name,' ',m.last_name) AS volunteer_name,
                      e.title AS event_title, e.start_date
               FROM volunteer_assignments va
               JOIN volunteers v ON v.id = va.volunteer_id
               JOIN members    m ON m.id = v.member_id
               JOIN events     e ON e.id = va.event_id WHERE 1=1`;
    const params = [];
    if (volunteer_id) { sql += ' AND va.volunteer_id = ?'; params.push(volunteer_id); }
    if (event_id)     { sql += ' AND va.event_id = ?';     params.push(event_id); }
    sql += ' ORDER BY va.schedule DESC';
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function assign(req, res, next) {
  try {
    const { volunteer_id, event_id, role, schedule, notes } = req.body;
    if (!volunteer_id || !event_id || !role) {
      return res.status(400).json({ success: false, message: 'volunteer_id, event_id, role are required.' });
    }
    const [result] = await pool.execute(
      `INSERT INTO volunteer_assignments (volunteer_id, event_id, role, schedule, notes) VALUES (?, ?, ?, ?, ?)`,
      [volunteer_id, event_id, role, schedule || null, notes || null]
    );
    await logActivity({ userId: req.user.id, action: 'ASSIGN_VOLUNTEER', tableName: 'volunteer_assignments', recordId: result.insertId, description: `Assigned volunteer ${volunteer_id} to event ${event_id}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Volunteer assigned.', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateAssignment(req, res, next) {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE volunteer_assignments SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: 'Assignment updated.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, getAssignments, assign, updateAssignment };
