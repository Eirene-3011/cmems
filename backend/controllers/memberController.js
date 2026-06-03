const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const { search, status } = req.query;
    let sql  = `SELECT id, first_name, middle_name, last_name, gender, birthdate,
                       contact_number, email, address, date_joined, status, created_at
                FROM members WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (last_name LIKE ? OR first_name LIKE ? OR email LIKE ? OR contact_number LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status) { sql += ' AND status = ?'; params.push(status); }
    sql += ' ORDER BY last_name, first_name';

    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT m.*, GROUP_CONCAT(DISTINCT mi.name ORDER BY mi.name SEPARATOR ', ') AS ministries
       FROM members m
       LEFT JOIN member_ministries mm ON mm.member_id = m.id AND mm.status = 'Active'
       LEFT JOIN ministries mi ON mi.id = mm.ministry_id
       WHERE m.id = ?
       GROUP BY m.id`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { first_name, middle_name, last_name, gender, birthdate, contact_number, email, address, date_joined, status = 'Active' } = req.body;
    if (!first_name || !last_name || !gender) {
      return res.status(400).json({ success: false, message: 'first_name, last_name, and gender are required.' });
    }
    const [result] = await pool.execute(
      `INSERT INTO members (first_name, middle_name, last_name, gender, birthdate, contact_number, email, address, date_joined, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, middle_name || null, last_name, gender, birthdate || null, contact_number || null, email || null, address || null, date_joined || null, status]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'members', recordId: result.insertId, description: `Created member: ${first_name} ${last_name}`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Member created.', id: result.insertId });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { first_name, middle_name, last_name, gender, birthdate, contact_number, email, address, date_joined, status } = req.body;
    const [existing] = await pool.execute('SELECT id FROM members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Member not found.' });

    await pool.execute(
      `UPDATE members SET first_name=?, middle_name=?, last_name=?, gender=?, birthdate=?,
       contact_number=?, email=?, address=?, date_joined=?, status=? WHERE id=?`,
      [first_name, middle_name || null, last_name, gender, birthdate || null, contact_number || null, email || null, address || null, date_joined || null, status, req.params.id]
    );
    await logActivity({ userId: req.user.id, action: 'UPDATE', tableName: 'members', recordId: req.params.id, description: `Updated member id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Member updated.' });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const [existing] = await pool.execute('SELECT id FROM members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Member not found.' });
    await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
    await logActivity({ userId: req.user.id, action: 'DELETE', tableName: 'members', recordId: req.params.id, description: `Deleted member id ${req.params.id}`, ipAddress: req.ip });
    res.json({ success: true, message: 'Member deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
