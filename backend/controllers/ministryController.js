const { pool }        = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT mi.id, mi.name, mi.description, mi.leader_id, mi.status,
              mi.created_at, mi.updated_at,
              (SELECT CONCAT(m.first_name,' ',m.last_name)
               FROM members m WHERE m.id = mi.leader_id) AS leader_name,
              (SELECT COUNT(DISTINCT mm.member_id)
               FROM member_ministries mm
               WHERE mm.ministry_id = mi.id AND mm.status = 'Active') AS member_count
       FROM ministries mi
       ORDER BY mi.name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT mi.id, mi.name, mi.description, mi.leader_id, mi.status,
              mi.created_at, mi.updated_at,
              (SELECT CONCAT(m.first_name,' ',m.last_name)
               FROM members m WHERE m.id = mi.leader_id) AS leader_name
       FROM ministries mi
       WHERE mi.id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Ministry not found.' });

    const [members] = await pool.execute(
      `SELECT me.id, me.first_name, me.last_name, mm.role, mm.date_joined
       FROM member_ministries mm
       JOIN members me ON me.id = mm.member_id
       WHERE mm.ministry_id = ? AND mm.status = 'Active'
       ORDER BY me.last_name`, [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], members } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, description, leader_id, status = 'Active' } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });
    const [result] = await pool.execute(
      'INSERT INTO ministries (name, description, leader_id, status) VALUES (?, ?, ?, ?)',
      [name, description || null, leader_id || null, status]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'ministries', recordId: result.insertId, description: `Created ministry: ${name}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Ministry created.', id: result.insertId });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { name, description, leader_id, status } = req.body;
    const [existing] = await pool.execute('SELECT id FROM ministries WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    await pool.execute(
      'UPDATE ministries SET name=?, description=?, leader_id=?, status=? WHERE id=?',
      [name, description || null, leader_id || null, status, req.params.id]
    );
    await logActivity({ userId: req.user.id, action: 'UPDATE', tableName: 'ministries', recordId: req.params.id, description: `Updated ministry id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Ministry updated.' });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const [existing] = await pool.execute('SELECT id FROM ministries WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    await pool.execute('DELETE FROM ministries WHERE id = ?', [req.params.id]);
    await logActivity({ userId: req.user.id, action: 'DELETE', tableName: 'ministries', recordId: req.params.id, description: `Deleted ministry id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Ministry deleted.' });
  } catch (err) { next(err); }
}

async function assignMember(req, res, next) {
  try {
    const { member_id, role = 'Member' } = req.body;
    const ministry_id = req.params.id;
    await pool.execute(
      `INSERT INTO member_ministries (member_id, ministry_id, role)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status='Active', role=VALUES(role)`,
      [member_id, ministry_id, role]
    );
    res.json({ success: true, message: 'Member assigned to ministry.' });
  } catch (err) { next(err); }
}

async function removeMember(req, res, next) {
  try {
    await pool.execute(
      `UPDATE member_ministries SET status='Inactive' WHERE ministry_id=? AND member_id=?`,
      [req.params.id, req.params.memberId]
    );
    res.json({ success: true, message: 'Member removed from ministry.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove, assignMember, removeMember };
