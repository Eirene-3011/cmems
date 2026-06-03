const { pool } = require('../config/db');

async function logActivity({ userId, action, tableName, recordId, description, ipAddress }) {
  try {
    await pool.execute(
      `INSERT INTO activity_logs (user_id, action, table_name, record_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, action, tableName || null, recordId || null, description || null, ipAddress || null]
    );
  } catch (err) {
    console.error('[Logger] Failed to write activity log:', err.message);
  }
}

module.exports = { logActivity };
