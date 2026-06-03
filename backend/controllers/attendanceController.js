const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function getAll(req, res, next) {
  try {
    const { event_id, member_id, status } = req.query;
    let sql = `SELECT a.*, CONCAT(m.first_name,' ',m.last_name) AS member_name,
                      e.title AS event_title, e.start_date AS event_date
               FROM attendance a
               JOIN members m ON m.id = a.member_id
               JOIN events  e ON e.id = a.event_id
               WHERE 1=1`;
    const params = [];
    if (event_id)  { sql += ' AND a.event_id = ?';  params.push(event_id); }
    if (member_id) { sql += ' AND a.member_id = ?'; params.push(member_id); }
    if (status)    { sql += ' AND a.status = ?';    params.push(status); }
    sql += ' ORDER BY a.attendance_date DESC, m.last_name';
    const [rows] = await pool.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function record(req, res, next) {
  try {
    const records = req.body.records; // array of { event_id, member_id, attendance_date, status, notes }
    if (!Array.isArray(records) || !records.length) {
      return res.status(400).json({ success: false, message: 'records array is required.' });
    }

    const values = records.map(r => [
      r.event_id, r.member_id, r.attendance_date, r.status || 'Present', r.notes || null, req.user.id
    ]);

    for (const v of values) {
      await pool.execute(
        `INSERT INTO attendance (event_id, member_id, attendance_date, status, notes, recorded_by)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status=VALUES(status), notes=VALUES(notes), recorded_by=VALUES(recorded_by)`,
        v
      );
    }

    await logActivity({ userId: req.user.id, action: 'RECORD_ATTENDANCE', tableName: 'attendance', description: `Recorded ${records.length} attendance entries`, ipAddress: req.ip });
    res.json({ success: true, message: `${records.length} attendance record(s) saved.` });
  } catch (err) { next(err); }
}

async function getSummary(req, res, next) {
  try {
    const { event_id } = req.query;
    if (!event_id) return res.status(400).json({ success: false, message: 'event_id is required.' });

    const [summary] = await pool.execute(
      `SELECT status, COUNT(*) AS count FROM attendance WHERE event_id = ? GROUP BY status`, [event_id]
    );
    res.json({ success: true, data: summary });
  } catch (err) { next(err); }
}

module.exports = { getAll, record, getSummary };
