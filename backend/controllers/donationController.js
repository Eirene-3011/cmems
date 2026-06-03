const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const { type, from_date, to_date, member_id } = req.query;
    let sql = `SELECT d.*, CONCAT(m.first_name,' ',m.last_name) AS member_name
               FROM donations d LEFT JOIN members m ON m.id = d.member_id WHERE 1=1`;
    const params = [];
    if (type)      { sql += ' AND d.donation_type = ?';    params.push(type); }
    if (from_date) { sql += ' AND d.donation_date >= ?';   params.push(from_date); }
    if (to_date)   { sql += ' AND d.donation_date <= ?';   params.push(to_date); }
    if (member_id) { sql += ' AND d.member_id = ?';        params.push(member_id); }
    sql += ' ORDER BY d.donation_date DESC';
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { member_id, donor_name, amount, donation_date, donation_type, remarks } = req.body;
    if (!amount || !donation_type) {
      return res.status(400).json({ success: false, message: 'amount and donation_type are required.' });
    }
    const [result] = await pool.execute(
      `INSERT INTO donations (member_id, donor_name, amount, donation_date, donation_type, remarks, received_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [member_id || null, donor_name || null, amount, donation_date || null, donation_type, remarks || null, req.user.id]
    );
    await logActivity({ userId: req.user.id, action: 'CREATE', tableName: 'donations', recordId: result.insertId, description: `Recorded donation ₱${amount} (${donation_type})`, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Donation recorded.', id: result.insertId });
  } catch (err) { next(err); }
}

async function getMonthlyTotals(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT DATE_FORMAT(donation_date, '%Y-%m') AS month,
              donation_type,
              SUM(amount) AS total
       FROM donations
       WHERE donation_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY month, donation_type
       ORDER BY month`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, getMonthlyTotals };
