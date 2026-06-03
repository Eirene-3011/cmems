const { pool } = require('../config/db');

async function getSummary(req, res, next) {
  try {
    const [[{ total_members }]]     = await pool.execute('SELECT COUNT(*) AS total_members FROM members WHERE status="Active"');
    const [[{ total_ministries }]]  = await pool.execute('SELECT COUNT(*) AS total_ministries FROM ministries WHERE status="Active"');
    const [[{ total_choir }]]       = await pool.execute('SELECT COUNT(*) AS total_choir FROM choir_members WHERE status="Active"');
    const [[{ total_volunteers }]]  = await pool.execute('SELECT COUNT(*) AS total_volunteers FROM volunteers WHERE status="Active"');
    const [[{ monthly_donations }]] = await pool.execute(
      `SELECT COALESCE(SUM(amount),0) AS monthly_donations
       FROM donations WHERE MONTH(donation_date)=MONTH(CURDATE()) AND YEAR(donation_date)=YEAR(CURDATE())`
    );

    const [upcoming_events] = await pool.execute(
      `SELECT id, title, event_type, start_date, venue, capacity
       FROM events WHERE status='Upcoming' AND start_date >= NOW()
       ORDER BY start_date LIMIT 5`
    );

    const [attendance_trend] = await pool.execute(
      `SELECT DATE_FORMAT(a.attendance_date,'%Y-%m') AS month,
              COUNT(CASE WHEN a.status='Present' THEN 1 END) AS present,
              COUNT(CASE WHEN a.status='Absent'  THEN 1 END) AS absent
       FROM attendance a
       WHERE a.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month`
    );

    const [donation_trend] = await pool.execute(
      `SELECT DATE_FORMAT(donation_date,'%Y-%m') AS month,
              SUM(amount) AS total
       FROM donations
       WHERE donation_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month`
    );

    const [top_ministries] = await pool.execute(
      `SELECT mi.name, COUNT(DISTINCT mm.member_id) AS member_count
       FROM ministries mi
       LEFT JOIN member_ministries mm ON mm.ministry_id = mi.id AND mm.status='Active'
       WHERE mi.status='Active'
       GROUP BY mi.id ORDER BY member_count DESC LIMIT 5`
    );

    const [recent_activities] = await pool.execute(
      `SELECT al.*, CONCAT(u.first_name,' ',u.last_name) AS user_name
       FROM activity_logs al LEFT JOIN users u ON u.id = al.user_id
       ORDER BY al.created_at DESC LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        stats: { total_members, total_ministries, total_choir, total_volunteers, monthly_donations },
        upcoming_events,
        attendance_trend,
        donation_trend,
        top_ministries,
        recent_activities
      }
    });
  } catch (err) { next(err); }
}

async function getMinistryParticipation(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM vw_ministry_participation_dashboard ORDER BY ministry_name, member_name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getUsersList(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.status, u.created_at, r.name AS role
       FROM users u JOIN roles r ON r.id = u.role_id ORDER BY u.last_name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = { getSummary, getMinistryParticipation, getUsersList };
