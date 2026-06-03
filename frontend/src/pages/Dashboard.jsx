import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart
} from 'recharts';
import {
  FiUsers, FiBookOpen, FiMusic, FiCalendar,
  FiDollarSign, FiHeart, FiTrendingUp, FiActivity,
  FiArrowUpRight, FiArrowDownRight, FiSunrise, FiMoreHorizontal,
  FiChevronRight, FiZap, FiArrowRight, FiStar, FiCheck
} from 'react-icons/fi';

/* ─── Palette ─── */
const C = {
  obsidian:  '#080c14',
  navy:      '#0b1220',
  slate:     '#111b2e',
  panel:     '#141e30',
  lift:      '#1a2640',
  border:    'rgba(120,150,210,0.1)',
  border2:   'rgba(120,150,210,0.18)',
  sapphire:  '#1a4fa0',
  azure:     '#2563eb',
  sky:       '#3b82f6',
  ice:       '#93c5fd',
  amber:     '#92400e',
  gold:      '#d97706',
  gold2:     '#f59e0b',
  parchment: '#fef3c7',
  rose:      '#e11d48',
  emerald:   '#059669',
  violet:    '#7c3aed',
  text:      '#e8edf8',
  sub:       '#7c93b8',
  muted:     '#3d5278',
};

const PIE_COLORS = ['#2563eb', '#d97706', '#059669', '#7c3aed', '#db2777', '#0891b2'];

/* ─── Helpers ─── */
const formatPHP = v => `₱${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
const formatPHPShort = v => {
  const n = Number(v || 0);
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₱${(n / 1_000).toFixed(0)}k`;
  return `₱${n}`;
};

/* ─── Leaf Icon ─── */
function LeafIcon({ size, color = 'currentColor', style, className }) {
  const w = size || (style?.width) || 20;
  const h = size || (style?.height) || 20;
  return (
    <svg
      width={w} height={h}
      viewBox="0 0 24 24" fill="none"
      style={style} className={className}
      aria-hidden="true"
    >
      <path
        d="M6.5 20C6.5 20 5 13 9 9C13 5 20 4 20 4C20 4 20 11 16 15C12 19 6.5 20 6.5 20Z"
        fill="currentColor"
      />
      <path
        d="M6.5 20L12 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/* ─── Radiant leaf watermark ─── */
function RadiantLeaf() {
  return (
    <svg viewBox="0 0 300 300" fill="none" style={{
      position: 'absolute', top: -60, right: -60,
      width: 320, height: 320, opacity: 0.032, pointerEvents: 'none', zIndex: 0,
    }} aria-hidden="true">
      {[0,30,60,90,120,150].map((a, i) => (
        <line key={i} x1="150" y1="150"
          x2={150 + 160 * Math.cos((a * Math.PI) / 180)}
          y2={150 + 160 * Math.sin((a * Math.PI) / 180)}
          stroke="#d97706" strokeWidth="1" strokeDasharray="4 8" />
      ))}
      <path
        d="M80 240C80 240 65 170 105 130C145 90 220 80 220 80C220 80 220 155 180 195C140 235 80 240 80 240Z"
        fill="#d97706"
      />
      <path
        d="M80 240L140 175"
        stroke="#d97706"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="150" cy="150" r="80" stroke="#2563eb" strokeWidth="1.5" fill="none" />
      <circle cx="150" cy="150" r="120" stroke="#2563eb" strokeWidth="0.75" fill="none" strokeDasharray="6 12" />
    </svg>
  );
}

/* ─── Stained glass orb ─── */
function GlassOrb({ color, size = 200, style }) {
  return (
    <div style={{
      position: 'absolute',
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`,
      filter: 'blur(40px)',
      pointerEvents: 'none',
      ...style,
    }} aria-hidden="true" />
  );
}

/* ─── useCountUp ─── */
function useCountUp(target, duration = 1400, enabled = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled || target == null || isNaN(Number(target))) { setVal(target); return; }
    const n = Number(String(target).replace(/[^0-9.]/g, ''));
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * n));
      if (p < 1) requestAnimationFrame(step);
      else setVal(n);
    };
    requestAnimationFrame(step);
  }, [target, enabled]);
  return val;
}

/* ─── Enhanced StatCard ─── */
function StatCard({ icon: Icon, label, value, rawValue, gradient, accentColor, trend, delay = 0, featured = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const animated = useCountUp(rawValue ?? (typeof value === 'number' ? value : null), 1300, visible);
  const displayValue = rawValue != null || typeof value === 'number'
    ? (animated ?? 0).toLocaleString()
    : value;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`stat-card${featured ? ' stat-card--featured' : ''}`}
      style={{ animationDelay: `${delay}ms`, '--accent': accentColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="stat-card__glow" style={{ background: `radial-gradient(circle at 80% 20%, ${accentColor}18, transparent 65%)` }} />

      <div className="stat-card__top">
        <div className="stat-card__icon-wrap" style={{ background: gradient }}>
          <Icon style={{ width: 16, height: 16, color: '#fff', flexShrink: 0 }} />
        </div>
        {trend != null && (
          <div className={`stat-card__trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="stat-card__value">{displayValue ?? '—'}</div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__accent-bar" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
    </div>
  );
}

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip__row">
          <span className="chart-tooltip__dot" style={{ background: p.color }} />
          <span className="chart-tooltip__name">{p.name}:</span>
          <span className="chart-tooltip__val">
            {currency ? formatPHPShort(p.value) : p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Enhanced Panel ─── */
function Panel({ children, style, className = '', delay = 0 }) {
  return (
    <div className={`panel ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ─── Enhanced Section Header ─── */
function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-hdr">
      <div>
        <h2 className="section-hdr__title">{title}</h2>
        {subtitle && <p className="section-hdr__sub">{subtitle}</p>}
      </div>
      {action && <div className="section-hdr__action">{action}</div>}
    </div>
  );
}

/* ─── Enhanced Event Card ─── */
function EventCard({ ev, index }) {
  const d = new Date(ev.start_date);
  const month = d.toLocaleDateString('en-PH', { month: 'short' });
  const day = d.getDate();
  const weekday = d.toLocaleDateString('en-PH', { weekday: 'short' });

  return (
    <div className="event-card" style={{ animationDelay: `${index * 55}ms` }}>
      <div className="event-card__cal">
        <span className="event-card__weekday">{weekday}</span>
        <span className="event-card__day">{day}</span>
        <span className="event-card__month">{month}</span>
      </div>
      <div className="event-card__body">
        <p className="event-card__title">{ev.title}</p>
        <p className="event-card__meta">
          <span className="event-card__venue-dot" />
          {ev.venue}
          {ev.capacity && <> · <span style={{ color: C.gold2 }}>{ev.capacity} seats</span></>}
        </p>
      </div>
      <FiChevronRight size={14} style={{ color: C.muted, flexShrink: 0, marginLeft: 'auto' }} />
    </div>
  );
}

/* ─── Activity badge ─── */
const ACTION_CFG = {
  CREATE: { bg: 'rgba(5,150,105,.12)', color: '#34d399', border: 'rgba(5,150,105,.22)', label: 'Create' },
  UPDATE: { bg: 'rgba(37,99,235,.12)', color: '#93c5fd', border: 'rgba(37,99,235,.22)', label: 'Update' },
  DELETE: { bg: 'rgba(225,29,72,.12)', color: '#fb7185', border: 'rgba(225,29,72,.22)', label: 'Delete' },
  LOGIN:  { bg: 'rgba(217,119,6,.12)', color: '#fcd34d', border: 'rgba(217,119,6,.22)', label: 'Login'  },
};

function ActionBadge({ action }) {
  const cfg = ACTION_CFG[action?.toUpperCase()] || { bg: 'rgba(120,150,210,.1)', color: C.sub, border: C.border, label: action };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 6,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      fontSize: '.68rem', fontWeight: 700, letterSpacing: '.05em',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>{cfg.label}</span>
  );
}

/* ─── Avatar ─── */
function Avatar({ name, size = 32 }) {
  const initials = (name || 'S')[0].toUpperCase();
  const hue = ((name || '').charCodeAt(0) * 37) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, hsl(${hue},60%,35%), hsl(${hue + 40},70%,50%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: '#fff',
      flexShrink: 0, letterSpacing: '.02em',
      boxShadow: `0 2px 8px hsla(${hue},60%,40%,.35)`,
    }}>{initials}</div>
  );
}

/* ─── Loading Skeleton ─── */
function Skeleton({ w = '100%', h = 20, r = 8 }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />;
}

/* ─── Greeting ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: '🌅' };
  if (h < 17) return { text: 'Good afternoon', icon: '☀️' };
  return { text: 'Good evening', icon: '🌙' };
}

/* ══════════════════════════════════════════════
   MAIN DASHBOARD - ENHANCED
══════════════════════════════════════════════ */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const {
    stats = {},
    upcoming_events   = [],
    attendance_trend  = [],
    donation_trend    = [],
    top_ministries    = [],
    recent_activities = [],
  } = data || {};

  const greeting = getGreeting();

  return (
    <>
      <style>{`
        /* ── Reset & Root ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --obsidian:  #080c14;
          --navy:      #0b1220;
          --slate:     #111b2e;
          --panel:     #141e30;
          --lift:      #1a2640;
          --border:    rgba(120,150,210,0.1);
          --border2:   rgba(120,150,210,0.18);
          --azure:     #2563eb;
          --sky:       #3b82f6;
          --ice:       #93c5fd;
          --gold:      #d97706;
          --gold2:     #f59e0b;
          --parchment: #fef3c7;
          --text:      #e8edf8;
          --sub:       #7c93b8;
          --muted:     #3d5278;
          --success:   #059669;
          --danger:    #e11d48;
        }

        html, body, #root { background: #0b1220 !important; }
        main, .main-content, .layout-main, .page-content,
        [class*="content"], [class*="layout"], [class*="main"],
        [class*="page"] {
          background: #0b1220 !important;
        }

        /* ── Keyframes ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes sweep {
          from { left: -80%; }
          to   { left: 120%; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Root layout ── */
        .db {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text);
          background: var(--navy);
          min-height: 100vh;
          width: 100%;
          padding: 2.5rem 2rem 4rem;
          position: relative;
          overflow-x: hidden;
        }

        .db::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(37,99,235,.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(217,119,6,.05) 0%, transparent 55%),
            var(--navy);
          pointer-events: none; z-index: -1;
        }

        /* ── Page header ── */
        .db-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 1;
        }

        .db-header__eyebrow {
          display: flex; align-items: center; gap: .5rem;
          font-size: .7rem; color: var(--sub);
          text-transform: uppercase; letter-spacing: .08em;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          margin-bottom: .75rem;
          animation: slideInLeft .5s ease both;
        }

        .db-header__eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold2);
          box-shadow: 0 0 8px rgba(245,158,11,.6);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .db-header__title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 2.8rem; font-weight: 700;
          color: var(--text); letter-spacing: -.02em;
          line-height: 1.1;
          display: flex; align-items: center; gap: .8rem;
          margin-bottom: .5rem;
          animation: slideInLeft .5s ease both .1s backwards;
        }

        .db-header__leaf {
          width: 32px; height: 32px;
          color: var(--gold2);
          filter: drop-shadow(0 0 8px rgba(245,158,11,.4));
        }

        .db-header__sub {
          font-size: .95rem; color: var(--sub);
          line-height: 1.6;
          max-width: 480px;
          animation: slideInLeft .5s ease both .2s backwards;
        }

        .db-header__meta {
          display: flex; flex-direction: column; gap: 1rem;
          align-items: flex-end;
          animation: slideInRight .5s ease both;
        }

        .db-header__date {
          display: flex; align-items: center; gap: .5rem;
          font-size: .8rem; color: var(--sub);
          background: rgba(37,99,235,.08);
          border: 1px solid rgba(37,99,235,.15);
          padding: .6rem 1rem;
          border-radius: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          transition: all .25s;
        }

        .db-header__date:hover {
          background: rgba(37,99,235,.12);
          border-color: rgba(37,99,235,.25);
        }

        .db-header__verse {
          font-size: .82rem; color: var(--sub);
          font-style: italic;
          max-width: 280px;
          text-align: right;
          line-height: 1.6;
        }

        /* ── Stat grid ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        /* ── Stat card ── */
        .stat-card {
          background: linear-gradient(135deg, rgba(20, 30, 48, 0.6), rgba(26, 38, 64, 0.4));
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          animation: fadeUp .55s ease both;
          transition: all .3s cubic-bezier(.16, 1, .3, 1);
          cursor: default;
          backdrop-filter: blur(8px);
        }

        .stat-card:hover {
          border-color: var(--accent);
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.2);
        }

        .stat-card--featured { grid-column: span 2; }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent);
          transform: skewX(-18deg);
          pointer-events: none;
          animation: none;
          transition: none;
        }
        .stat-card:hover::before { animation: sweep .6s ease forwards; }

        .stat-card__glow {
          position: absolute; inset: 0; pointer-events: none; border-radius: 18px;
          opacity: 0; transition: opacity .3s;
        }
        .stat-card:hover .stat-card__glow { opacity: 1; }

        .stat-card__top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .stat-card__icon-wrap {
          width: 44px; height: 44px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.15);
          position: relative; z-index: 1;
          transition: transform .3s;
        }
        .stat-card:hover .stat-card__icon-wrap { transform: scale(1.08); }

        .stat-card__trend {
          display: flex; align-items: center; gap: 3px;
          font-size: .68rem; font-weight: 700;
          padding: 4px 10px; border-radius: 99px;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: .03em;
          transition: all .25s;
        }
        .stat-card__trend.up   { background: rgba(5,150,105,.15); color: #34d399; border: 1px solid rgba(5,150,105,.25); }
        .stat-card__trend.down { background: rgba(225,29,72,.15);  color: #fb7185; border: 1px solid rgba(225,29,72,.25); }

        .stat-card__value {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 2.2rem; font-weight: 700;
          color: var(--text); line-height: 1;
          margin-bottom: .4rem;
          position: relative; z-index: 1;
          letter-spacing: -.02em;
          transition: color .25s;
        }
        .stat-card:hover .stat-card__value { color: var(--ice); }

        .stat-card__label {
          font-size: .76rem; color: var(--sub);
          font-weight: 500; position: relative; z-index: 1;
          letter-spacing: .01em;
          transition: color .25s;
        }
        .stat-card:hover .stat-card__label { color: var(--text); }

        .stat-card__accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; opacity: 0;
          border-radius: 0 0 18px 18px;
          transition: opacity .3s;
        }
        .stat-card:hover .stat-card__accent-bar { opacity: 1; }

        /* ── Panel / Card ── */
        .panel {
          background: linear-gradient(135deg, rgba(20, 30, 48, 0.5), rgba(26, 38, 64, 0.3));
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05);
          animation: fadeUp .55s ease both;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
          transition: all .3s;
        }
        .panel:hover {
          border-color: rgba(37,99,235,.2);
          box-shadow: 0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.08);
        }

        /* ── Chart row ── */
        .chart-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.75rem;
        }
        @media (max-width: 960px) { .chart-row { grid-template-columns: 1fr; } }

        /* ── Section header ── */
        .section-hdr {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .section-hdr__title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1.25rem; font-weight: 600;
          color: var(--text); letter-spacing: .01em;
          line-height: 1.2;
          transition: color .25s;
        }
        .section-hdr:hover .section-hdr__title { color: var(--ice); }

        .section-hdr__sub {
          font-size: .75rem; color: var(--sub);
          margin-top: .35rem; font-weight: 400;
        }

        .section-hdr__action {
          display: flex; align-items: center; gap: .5rem;
          font-size: .75rem; color: var(--sub);
          cursor: pointer; padding: .4rem .75rem;
          border-radius: 10px;
          transition: all .2s;
          white-space: nowrap;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          border: 1px solid transparent;
        }
        .section-hdr__action:hover {
          color: var(--ice);
          background: rgba(147,197,253,.08);
          border-color: rgba(147,197,253,.15);
        }

        .panel-divider {
          height: 1px;
          background: var(--border);
          margin: 1.5rem -2rem;
        }

        /* ── Chart tooltip ── */
        .chart-tooltip {
          background: var(--slate);
          border: 1px solid var(--border2);
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,.6);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: .8rem;
          min-width: 140px;
          backdrop-filter: blur(12px);
        }

        .chart-tooltip__label {
          color: var(--sub); font-size: .7rem;
          text-transform: uppercase; letter-spacing: .08em;
          margin-bottom: 8px;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
        }

        .chart-tooltip__row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 4px;
        }

        .chart-tooltip__dot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; }
        .chart-tooltip__name { color: var(--sub); font-size: .78rem; }
        .chart-tooltip__val  { color: var(--text); font-weight: 600; margin-left: auto; padding-left: 8px; }

        /* ── Bottom row ── */
        .bottom-row {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
          margin-bottom: 1.75rem;
        }
        @media (max-width: 1100px) { .bottom-row { grid-template-columns: 1fr; } }

        /* ── Event cards ── */
        .events-list {
          display: flex; flex-direction: column; gap: .65rem;
          max-height: 450px; overflow-y: auto;
          padding-right: .35rem;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .events-list::-webkit-scrollbar { width: 4px; }
        .events-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; transition: background .2s; }
        .events-list::-webkit-scrollbar-thumb:hover { background: var(--border2); }

        .event-card {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.1rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,.008);
          animation: fadeUp .45s ease both;
          transition: all .25s cubic-bezier(.16, 1, .3, 1);
          cursor: default;
        }
        .event-card:hover {
          background: rgba(37,99,235,.08);
          border-color: rgba(37,99,235,.25);
          transform: translateX(6px);
          box-shadow: 0 4px 16px rgba(37,99,235,.15);
        }

        .event-card__cal {
          display: flex; flex-direction: column; align-items: center;
          background: linear-gradient(160deg, var(--azure), #1e40af);
          color: #fff; border-radius: 14px;
          padding: .5rem .7rem;
          min-width: 52px; flex-shrink: 0;
          box-shadow: 0 6px 18px rgba(37,99,235,.4);
          text-align: center;
          transition: transform .25s;
        }
        .event-card:hover .event-card__cal { transform: scale(1.05); }

        .event-card__weekday { font-size: .57rem; text-transform: uppercase; letter-spacing: .1em; opacity: .8; font-family: 'Space Grotesk', sans-serif; }
        .event-card__day     { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; line-height: 1.05; }
        .event-card__month   { font-size: .57rem; text-transform: uppercase; letter-spacing: .08em; opacity: .85; font-family: 'Space Grotesk', sans-serif; }

        .event-card__title {
          font-size: .85rem; font-weight: 600; color: var(--text);
          margin-bottom: .2rem; line-height: 1.4;
          transition: color .25s;
        }
        .event-card:hover .event-card__title { color: var(--ice); }

        .event-card__meta {
          font-size: .72rem; color: var(--sub);
          display: flex; align-items: center; gap: .45rem;
        }

        .event-card__venue-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--azure); flex-shrink: 0;
          box-shadow: 0 0 6px rgba(37,99,235,.6);
        }

        .event-card__body { flex: 1; min-width: 0; }

        /* ── Ministry Pie ── */
        .pie-legend { display: flex; flex-direction: column; gap: .65rem; margin-top: 1rem; }

        .pie-legend-item {
          display: flex; align-items: center; gap: .75rem;
          font-size: .78rem; padding: .45rem .65rem;
          border-radius: 10px; transition: all .2s; cursor: default;
        }
        .pie-legend-item:hover { background: rgba(255,255,255,.03); }

        .pie-legend-swatch {
          width: 11px; height: 11px; border-radius: 4px; flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
        }

        .pie-legend-name { flex: 1; color: var(--sub); }
        .pie-legend-val  { font-weight: 700; color: var(--text); font-family: 'Space Grotesk', sans-serif; font-size: .82rem; }

        .pie-legend-bar-wrap {
          width: 64px; height: 5px; background: rgba(255,255,255,.06);
          border-radius: 99px; overflow: hidden;
        }
        .pie-legend-bar { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.16,1,.3,1); }

        /* ── Activity table ── */
        .activity-wrap { overflow-x: auto; }
        .activity-wrap::-webkit-scrollbar { height: 5px; }
        .activity-wrap::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .activity-table { width: 100%; border-collapse: collapse; font-size: .83rem; }
        .activity-table thead tr { border-bottom: 1px solid var(--border); }

        .activity-table th {
          text-align: left; padding: .65rem 1rem;
          font-size: .65rem; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: .1em; white-space: nowrap;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .activity-table tbody tr {
          border-bottom: 1px solid rgba(120,150,210,.06);
          transition: background .2s;
        }
        .activity-table tbody tr:last-child { border-bottom: none; }
        .activity-table tbody tr:hover { background: rgba(255,255,255,.03); }

        .activity-table td { padding: .85rem 1rem; color: var(--text); vertical-align: middle; }
        .activity-table td.dim { color: var(--sub); }
        .activity-table td.xs { font-size: .74rem; white-space: nowrap; color: var(--muted); font-family: 'Space Grotesk', sans-serif; }

        .td-user { display: flex; align-items: center; gap: .75rem; font-weight: 500; }

        /* ── Quick stats banner ── */
        .banner {
          background: linear-gradient(135deg, rgba(26,79,160,.25) 0%, rgba(13,23,48,.95) 40%, rgba(146,64,14,.18) 100%);
          border: 1px solid rgba(37,99,235,.22);
          border-radius: 22px;
          padding: 1.75rem 2rem;
          margin-bottom: 1.75rem;
          animation: fadeUp .45s ease both;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
          backdrop-filter: blur(10px);
          transition: all .3s;
        }
        .banner:hover {
          border-color: rgba(37,99,235,.35);
          box-shadow: 0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1);
        }

        .banner__content {
          display: flex; align-items: center; gap: 1.75rem;
          flex-wrap: wrap; position: relative; z-index: 1;
        }

        .banner__icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, rgba(37,99,235,.35), rgba(37,99,235,.15));
          border: 1px solid rgba(37,99,235,.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 24px rgba(37,99,235,.25);
          animation: float 4s ease-in-out infinite;
          transition: transform .3s;
        }
        .banner:hover .banner__icon-wrap { transform: scale(1.08); }

        .banner__text { flex: 1; min-width: 200px; }

        .banner__title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1.3rem; font-weight: 600; color: var(--text);
          letter-spacing: .01em; margin-bottom: .4rem;
        }

        .banner__sub { font-size: .82rem; color: var(--sub); line-height: 1.6; }

        .banner__pills { display: flex; gap: .75rem; flex-wrap: wrap; }

        .banner__pill {
          display: flex; align-items: center; gap: .5rem;
          padding: .5rem 1rem; border-radius: 99px;
          font-size: .75rem; font-weight: 600;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: .03em; white-space: nowrap;
          transition: all .25s;
        }
        .banner__pill--blue  { background: rgba(37,99,235,.16); color: var(--ice); border: 1px solid rgba(37,99,235,.25); }
        .banner__pill--gold  { background: rgba(217,119,6,.16); color: var(--gold2); border: 1px solid rgba(217,119,6,.25); }
        .banner__pill--green { background: rgba(5,150,105,.16); color: #34d399; border: 1px solid rgba(5,150,105,.25); }
        .banner__pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.2); }

        /* ── Empty state ── */
        .empty {
          display: flex; flex-direction: column; align-items: center;
          gap: .8rem; padding: 3rem 1.5rem;
          color: var(--muted); font-size: .85rem;
        }
        .empty-icon { width: 36px; height: 36px; opacity: .3; }

        /* ── Loading ── */
        .db-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 60vh; gap: 1.5rem;
        }

        .db-spinner-wrap {
          width: 68px; height: 68px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }

        .db-spinner {
          position: absolute; inset: 0;
          border: 2.5px solid rgba(37,99,235,.15);
          border-top-color: var(--gold2);
          border-radius: 50%;
          animation: spin .9s linear infinite;
        }

        .db-spinner-inner {
          position: absolute; inset: 10px;
          border: 2.5px solid rgba(37,99,235,.1);
          border-bottom-color: var(--azure);
          border-radius: 50%;
          animation: spin .6s linear infinite reverse;
        }

        .db-spinner-leaf {
          width: 20px; height: 20px; color: var(--gold2);
          filter: drop-shadow(0 0 8px rgba(245,158,11,.6));
        }

        /* ── Skeleton ── */
        .skeleton {
          background: linear-gradient(90deg,
            rgba(255,255,255,.04) 25%,
            rgba(255,255,255,.08) 50%,
            rgba(255,255,255,.04) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .db { padding: 1.5rem 1rem 3rem; width: 100%; }
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-card { padding: 1.25rem; }
          .stat-card__value { font-size: 1.7rem; }
          .stat-card--featured { grid-column: span 2; }
          .panel { padding: 1.5rem; }
          .banner { padding: 1.25rem 1.5rem; }
          .db-header { flex-direction: column; gap: 1.5rem; }
          .db-header__title { font-size: 1.8rem; }
          .db-header__meta { align-items: flex-start; }
          .db-header__verse { text-align: left; }
          .bottom-row { grid-template-columns: 1fr; }
          .chart-row { grid-template-columns: 1fr; }
          .banner__pills { gap: .5rem; }
          .banner__pill { font-size: .7rem; padding: .4rem .8rem; }
        }

        /* ── Focus states for accessibility ── */
        .section-hdr__action:focus-visible,
        .banner__pill:focus-visible {
          outline: 2px solid var(--azure);
          outline-offset: 2px;
        }
      `}</style>

      <div className="db">
        {/* Ambient orbs */}
        <GlassOrb color="#2563eb" size={400} style={{ top: -100, right: -100, zIndex: 0 }} />
        <GlassOrb color="#d97706" size={300} style={{ bottom: 200, left: -80, zIndex: 0 }} />

        {/* ── Page header ── */}
        <div className="db-header">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="db-header__eyebrow">
              <div className="db-header__eyebrow-dot" />
              Church Management · Overview
            </div>
            <h1 className="db-header__title">
              <LeafIcon className="db-header__leaf" style={{ width: 32, height: 32 }} />
              Dashboard
            </h1>
            <p className="db-header__sub">
              {greeting.icon}&nbsp; {greeting.text} — here's what's happening in your church community.
            </p>
          </div>
          <div className="db-header__meta">
            <div className="db-header__date">
              <FiCalendar size={12} />
              {new Date().toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="db-header__verse">"For where two or three gather… I am there." — Matt 18:20</div>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading ? (
          <div className="db-loading">
            <div className="db-spinner-wrap">
              <div className="db-spinner" />
              <div className="db-spinner-inner" />
              <LeafIcon className="db-spinner-leaf" style={{ width: 20, height: 20, color: C.gold2 }} />
            </div>
            <p style={{ fontSize: '.85rem', color: C.sub, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Loading church data…
            </p>
          </div>
        ) : (
          <>
            {/* ── Welcome banner ── */}
            <div className="banner" style={{ animationDelay: '0ms' }}>
              <RadiantLeaf />
              <GlassOrb color="#2563eb" size={180} style={{ top: -40, right: 80, opacity: .5 }} />
              <div className="banner__content">
                <div className="banner__icon-wrap">
                  <LeafIcon style={{ width: 26, height: 26, color: C.ice }} />
                </div>
                <div className="banner__text">
                  <div className="banner__title">Your Community at a Glance</div>
                  <div className="banner__sub">
                    Serving faithfully · {new Date().toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="banner__pills">
                  <div className="banner__pill banner__pill--blue">
                    <FiUsers size={12} /> {stats?.total_members ?? '—'} Members
                  </div>
                  <div className="banner__pill banner__pill--gold">
                    <FiDollarSign size={12} /> {formatPHPShort(stats?.monthly_donations)} This Month
                  </div>
                  <div className="banner__pill banner__pill--green">
                    <FiHeart size={12} /> {stats?.total_volunteers ?? '—'} Volunteers
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="stat-grid">
              <StatCard delay={0}   icon={FiUsers}      label="Active Members"    rawValue={stats?.total_members}    gradient="linear-gradient(135deg,#1a4fa0,#2563eb)" accentColor="#3b82f6" trend={4}  />
              <StatCard delay={55}  icon={FiBookOpen}   label="Ministries"        rawValue={stats?.total_ministries} gradient="linear-gradient(135deg,#92400e,#d97706)" accentColor="#f59e0b" trend={0}  />
              <StatCard delay={110} icon={FiMusic}      label="Choir Members"     rawValue={stats?.total_choir}      gradient="linear-gradient(135deg,#5b21b6,#7c3aed)" accentColor="#a78bfa" trend={2}  />
              <StatCard delay={165} icon={FiHeart}      label="Volunteers"        rawValue={stats?.total_volunteers} gradient="linear-gradient(135deg,#065f46,#059669)" accentColor="#34d399" trend={8}  />
              <StatCard delay={220} icon={FiDollarSign} label="Monthly Donations" value={formatPHP(stats?.monthly_donations)} gradient="linear-gradient(135deg,#0f766e,#14b8a6)" accentColor="#2dd4bf" />
              <StatCard delay={275} icon={FiCalendar}   label="Upcoming Events"   rawValue={upcoming_events.length}  gradient="linear-gradient(135deg,#0369a1,#0ea5e9)" accentColor="#38bdf8" />
            </div>

            {/* ── Charts ── */}
            <div className="chart-row">
              {/* Attendance */}
              <Panel delay={120}>
                <SectionHeader
                  title="Attendance Trend"
                  subtitle="6-month overview"
                  action={<><FiMoreHorizontal size={14} /> View all</>}
                />
                {attendance_trend.length === 0 ? (
                  <div className="empty"><FiActivity className="empty-icon" /><span>No data available</span></div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={attendance_trend} barGap={4} barCategoryGap="32%">
                      <defs>
                        <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e11d48" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#9f1239" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,150,210,.07)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.sub, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,.03)', radius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: '.75rem', fontFamily: "'Space Grotesk'", paddingTop: 12 }} />
                      <Bar dataKey="present" name="Present" fill="url(#presentGrad)" radius={[8, 8, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="absent"  name="Absent"  fill="url(#absentGrad)"  radius={[8, 8, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Panel>

              {/* Donations */}
              <Panel delay={180}>
                <SectionHeader
                  title="Donation Trend"
                  subtitle="6-month overview"
                  action={<><FiTrendingUp size={14} /> View report</>}
                />
                {donation_trend.length === 0 ? (
                  <div className="empty"><FiDollarSign className="empty-icon" /><span>No data available</span></div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={donation_trend}>
                      <defs>
                        <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#d97706" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="goldLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor="#b45309" />
                          <stop offset="50%"  stopColor="#d97706" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,150,210,.07)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.sub, fontFamily: "'Space Grotesk'" }} axisLine={false} tickLine={false} width={48} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<ChartTooltip currency />} />
                      <Area
                        type="monotone" dataKey="total" name="Donations"
                        stroke="url(#goldLineGrad)" strokeWidth={3}
                        fill="url(#goldAreaGrad)"
                        dot={{ r: 5, fill: '#d97706', strokeWidth: 0 }}
                        activeDot={{ r: 7, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Panel>
            </div>

            {/* ── Bottom row ── */}
            <div className="bottom-row">
              {/* Ministry Pie */}
              <Panel delay={240}>
                <SectionHeader title="Ministry Distribution" subtitle="Member allocation" />
                {top_ministries.length === 0 ? (
                  <div className="empty"><FiBookOpen className="empty-icon" /><span>No ministry data</span></div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <defs>
                          {top_ministries.map((_, i) => (
                            <radialGradient key={i} id={`pieGrad${i}`} cx="30%" cy="30%">
                              <stop offset="0%" stopColor={PIE_COLORS[i % PIE_COLORS.length]} stopOpacity="1" />
                              <stop offset="100%" stopColor={PIE_COLORS[i % PIE_COLORS.length]} stopOpacity="0.7" />
                            </radialGradient>
                          ))}
                        </defs>
                        <Pie
                          data={top_ministries} dataKey="member_count" nameKey="name"
                          cx="50%" cy="50%" outerRadius={82} innerRadius={48}
                          strokeWidth={3} stroke={C.panel} paddingAngle={3}
                        >
                          {top_ministries.map((_, i) => (
                            <Cell key={i} fill={`url(#pieGrad${i})`} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v, n) => [v, n]}
                          contentStyle={{
                            borderRadius: 14, background: C.slate,
                            border: `1px solid ${C.border2}`,
                            boxShadow: '0 12px 40px rgba(0,0,0,.5)',
                            fontFamily: "'DM Sans', sans-serif", fontSize: '.8rem',
                            color: C.text,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {(() => {
                      const total = top_ministries.reduce((s, m) => s + m.member_count, 0);
                      return (
                        <div className="pie-legend">
                          {top_ministries.map((m, i) => (
                            <div key={i} className="pie-legend-item">
                              <div className="pie-legend-swatch" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="pie-legend-name">{m.name}</span>
                              <div className="pie-legend-bar-wrap">
                                <div className="pie-legend-bar" style={{
                                  width: `${Math.round((m.member_count / total) * 100)}%`,
                                  background: PIE_COLORS[i % PIE_COLORS.length],
                                }} />
                              </div>
                              <span className="pie-legend-val">{m.member_count}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
              </Panel>

              {/* Upcoming events */}
              <Panel delay={300}>
                <SectionHeader
                  title="Upcoming Events"
                  subtitle={`${upcoming_events.length} scheduled`}
                  action={<><FiCalendar size={13} /> View calendar</>}
                />
                {upcoming_events.length === 0 ? (
                  <div className="empty"><FiCalendar className="empty-icon" /><span>No upcoming events</span></div>
                ) : (
                  <div className="events-list">
                    {upcoming_events.map((ev, i) => (
                      <EventCard key={ev.id} ev={ev} index={i} />
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            {/* ── Recent Activity ── */}
            <Panel delay={380}>
              <SectionHeader
                title="Recent Activity"
                subtitle="Latest system events"
                action={<><FiZap size={13} /> Live feed</>}
              />
              {recent_activities.length === 0 ? (
                <div className="empty"><FiActivity className="empty-icon" /><span>No recent activity</span></div>
              ) : (
                <div className="activity-wrap">
                  <table className="activity-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent_activities.map(a => (
                        <tr key={a.id}>
                          <td>
                            <div className="td-user">
                              <Avatar name={a.user_name || 'S'} size={32} />
                              {a.user_name || 'System'}
                            </div>
                          </td>
                          <td><ActionBadge action={a.action} /></td>
                          <td className="dim" style={{ maxWidth: 320 }}>{a.description}</td>
                          <td className="xs">{new Date(a.created_at).toLocaleString('en-PH')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </>
        )}
      </div>
    </>
  );
}
