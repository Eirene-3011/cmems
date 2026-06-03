const jwt     = require('jsonwebtoken');
const { pool }       = require('../config/db');
const { logActivity } = require('../utils/logger');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.password, u.status,
              r.name AS role, u.role_id
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = ?`,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Account is inactive. Contact an administrator.' });
    }

    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const payload = { id: user.id, email: user.email, role: user.role, role_id: user.role_id };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

    await logActivity({ userId: user.id, action: 'LOGIN', description: `User ${user.email} logged in`, ipAddress: req.ip });

    res.json({
      success: true,
      token,
      user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, role_id: user.role_id }
    });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password, role_id = 5 } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (role_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
      [role_id, first_name, last_name, email, password]
    );

    await logActivity({ userId: result.insertId, action: 'REGISTER', description: `New user registered: ${email}`, ipAddress: req.ip });

    res.status(201).json({ success: true, message: 'User registered successfully.', id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.status, u.created_at,
              r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, profile };