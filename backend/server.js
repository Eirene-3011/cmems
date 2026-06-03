require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { testConnection }         = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cmems.netlify.app',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/members',     require('./routes/members'));
app.use('/api/ministries',  require('./routes/ministries'));
app.use('/api/choirs',      require('./routes/choirs'));
app.use('/api/events',      require('./routes/events'));
app.use('/api/attendance',  require('./routes/attendance'));
app.use('/api/volunteers',  require('./routes/volunteers'));
app.use('/api/donations',   require('./routes/donations'));
app.use('/api/dashboard',   require('./routes/dashboard'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Error handling ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  CMEMS API running at http://localhost:${PORT}`);
    console.log(`📋  Health check:     http://localhost:${PORT}/api/health`);
  });
});
