import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiUsers, FiStar } from 'react-icons/fi';
/* ── Leaf Icon ── */

function LeafIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 20C6.5 20 5 13 9 9C13 5 20 4 20 4C20 4 20 11 16 15C12 19 6.5 20 6.5 20Z"
        fill={color}
      />
      <path
        d="M6.5 20L12 14"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/* ── Dove Icon ── */
function DoveIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M21 3c0 0-4.5 1-7 3.5C11.5 9 10 12 10 12s-1-1-3-1c-2 0-4 1.5-4 1.5s2 0 3 1c1 1 1 2 1 2S5.5 15 4 16c-1.5 1 0 3 0 3s1.5-2 3-2c2 0 3 1 3 1s-1 2 0 3c1 1 3 0 3 0s-1-2 0-4c1-2 3-3 5-4 2-1 3-2 3-2s-2 0-3-1c-1-1-1-3-1-3s2 1 4 0c2-1 2-4 2-4z"/>
    </svg>
  );
}

/* ── Ornamental divider ── */
function OrnamDivider() {
  return (
    <svg width="120" height="14" viewBox="0 0 120 14" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <line x1="0" y1="7" x2="46" y2="7" stroke="url(#lg1)" strokeWidth="1"/>
      <circle cx="53" cy="7" r="2" fill="#8b9fc8" opacity=".5"/>
      <circle cx="60" cy="7" r="3" fill="#8b9fc8" opacity=".7"/>
      <circle cx="67" cy="7" r="2" fill="#8b9fc8" opacity=".5"/>
      <line x1="74" y1="7" x2="120" y2="7" stroke="url(#lg2)" strokeWidth="1"/>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="46" y2="0">
          <stop offset="0%" stopColor="#8b9fc8" stopOpacity="0"/>
          <stop offset="100%" stopColor="#8b9fc8" stopOpacity=".5"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="46" y2="0">
          <stop offset="0%" stopColor="#8b9fc8" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#8b9fc8" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Stained-glass geometric SVG background panel ── */
function StainedGlass() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}
      viewBox="0 0 420 680"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c97a"/>
          <stop offset="100%" stopColor="#3b6cb7"/>
        </linearGradient>
        <linearGradient id="sg2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a87d0"/>
          <stop offset="100%" stopColor="#e8c97a"/>
        </linearGradient>
      </defs>
      {/* Large arch */}
      <path d="M80 620 L80 260 Q80 120 210 80 Q340 120 340 260 L340 620 Z" fill="none" stroke="url(#sg1)" strokeWidth="2"/>
      {/* Inner arch */}
      <path d="M110 600 L110 270 Q110 160 210 130 Q310 160 310 270 L310 600 Z" fill="none" stroke="url(#sg2)" strokeWidth="1.5"/>
      {/* Cross in arch */}
      <rect x="200" y="170" width="20" height="120" fill="none" stroke="#e8c97a" strokeWidth="2"/>
      <rect x="168" y="220" width="84" height="20" fill="none" stroke="#e8c97a" strokeWidth="2"/>
      {/* Decorative diamonds */}
      {[200, 250, 300, 350, 400, 450, 500, 550].map((y, i) => (
        <polygon key={i} points={`${70 + (i%2)*280},${y} ${85 + (i%2)*280},${y+15} ${70 + (i%2)*280},${y+30} ${55 + (i%2)*280},${y+15}`}
          fill="none" stroke="#8b9fc8" strokeWidth="1" opacity=".6"/>
      ))}
      {/* Tracery lines */}
      <line x1="210" y1="80" x2="210" y2="620" stroke="#e8c97a" strokeWidth=".5" strokeDasharray="4 8"/>
      <line x1="80" y1="350" x2="340" y2="350" stroke="#5a87d0" strokeWidth=".5" strokeDasharray="4 8"/>
    </svg>
  );
}

/* ── Floating particle ── */
function Particle({ style }) {
  return <div className="particle" style={style} aria-hidden="true" />;
}

const DEMOS = [
  { role: 'Super Admin',       email: 'admin@cmems.com',     icon: '⚡', badge: 'Full access',  color: '#e8c97a' },
  { role: 'Ministry Leader',   email: 'leader@cmems.com',    icon: '✦',  badge: 'Leadership',   color: '#7ba3dc' },
  { role: 'Choir Coordinator', email: 'choir@cmems.com',     icon: '♪',  badge: 'Coordinator',  color: '#a78bd4' },
  { role: 'Volunteer',         email: 'volunteer@cmems.com', icon: '◆',  badge: 'Volunteer',    color: '#6bb89e' },
  { role: 'Church Member',     email: 'member@cmems.com',    icon: '○',  badge: 'Member',       color: '#8ba8c8' },
];

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  size: 2 + Math.random() * 4,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 90}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${5 + Math.random() * 8}s`,
}));

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [visible, setVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(d) {
    setActiveDemo(d.email);
    setForm({ email: d.email, password: 'Admin@123' });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --night:      #0b0e17;
          --deep:       #0f1422;
          --panel:      #141929;
          --surface:    #1a2035;
          --surface2:   #1f263f;
          --lift:       #242c48;
          --border:     rgba(139,159,200,.1);
          --border2:    rgba(139,159,200,.18);
          --border3:    rgba(139,159,200,.28);

          --gold:       #e8c97a;
          --gold2:      #f5e09a;
          --goldDim:    rgba(232,201,122,.12);
          --goldGlow:   rgba(232,201,122,.22);

          --blue:       #3b6cb7;
          --blue2:      #5a87d0;
          --blue3:      #7ba3dc;
          --blueDim:    rgba(91,135,208,.15);
          --blueGlow:   rgba(91,135,208,.25);

          --text:       #e8ecf5;
          --textSub:    #8090b4;
          --textMuted:  #4e5c7e;
          --textFaint:  #2e3850;

          --success:    #6bb89e;
          --radius:     12px;
          --rLg:        18px;
          --rSm:        8px;

          --shadow-sm:  0 2px 8px rgba(0,0,0,.3);
          --shadow-md:  0 8px 32px rgba(0,0,0,.45);
          --shadow-lg:  0 20px 60px rgba(0,0,0,.6);
          --shadow-gold: 0 4px 24px rgba(232,201,122,.18);
          --shadow-blue: 0 4px 24px rgba(91,135,208,.2);
        }

        body { background: var(--night); font-family: 'Inter', sans-serif; }

        .lr {
          min-height: 100vh;
          background: var(--night);
          font-family: 'Inter', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Deep space background */
        .lr-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 15% 20%, rgba(59,108,183,.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 80%, rgba(232,201,122,.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 70% 10%, rgba(91,135,208,.07) 0%, transparent 55%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(15,20,34,.9) 0%, transparent 100%);
        }

        /* Grid */
        .lr-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(139,159,200,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,159,200,.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* Floating particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: var(--blue3);
          opacity: 0;
          animation: floatUp var(--dur, 7s) var(--delay, 0s) ease-in-out infinite;
        }

        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          20%  { opacity: .25; }
          80%  { opacity: .15; }
          100% { opacity: 0; transform: translateY(-80px) scale(.6); }
        }

        /* ── CARD ── */
        .card {
          position: relative; z-index: 10;
          width: 100%; max-width: 1020px;
          display: grid;
          grid-template-columns: 400px 1fr;
          border-radius: var(--rLg);
          overflow: hidden;
          border: 1px solid var(--border2);
          box-shadow: var(--shadow-lg), 0 0 80px -20px rgba(59,108,183,.15);
          opacity: 0;
          transform: translateY(24px) scale(.985);
          transition: opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1);
        }
        .card.in { opacity: 1; transform: translateY(0) scale(1); }

        @media (max-width: 780px) {
          .card { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 2.5rem 1.75rem; }
        }

        /* ══ LEFT PANEL ══ */
        .left-panel {
          background: var(--panel);
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          border-right: 1px solid var(--border);
        }

        /* Top gold bar */
        .left-panel::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--blue2) 80%, transparent 100%);
          opacity: .5;
          z-index: 2;
        }

        .lp-scroll {
          display: flex; flex-direction: column;
          height: 100%;
          padding: 2.25rem 1.875rem;
          position: relative; z-index: 1;
          overflow-y: auto;
        }

        /* Brand */
        .brand {
          display: flex; align-items: center; gap: .875rem;
          margin-bottom: 2.25rem;
        }

        .brand-mark {
          width: 42px; height: 42px;
          background: linear-gradient(150deg, var(--blue) 0%, var(--blue2) 60%, #6b9edc 100%);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-blue), inset 0 1px 0 rgba(255,255,255,.15);
          flex-shrink: 0;
          position: relative;
          transition: all .3s cubic-bezier(.16,1,.3,1);
        }

        .brand-mark::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,.12);
        }

        .brand-mark:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-blue), 0 0 20px rgba(91,135,208,.3), inset 0 1px 0 rgba(255,255,255,.2);
        }

        .brand-name {
          font-family: 'Inter', sans-serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -.01em;
          line-height: 1;
        }

        .brand-tagline {
          font-size: .62rem;
          color: var(--textMuted);
          letter-spacing: .14em;
          text-transform: uppercase;
          margin-top: .2rem;
          font-weight: 500;
        }

        /* Scripture verse */
        .verse-card {
          background: linear-gradient(135deg, rgba(59,108,183,.12) 0%, rgba(232,201,122,.06) 100%);
          border: 1px solid rgba(139,159,200,.14);
          border-radius: var(--radius);
          padding: 1.25rem 1.25rem 1.125rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
          transition: all .3s cubic-bezier(.16,1,.3,1);
        }

        .verse-card:hover {
          border-color: rgba(139,159,200,.24);
          box-shadow: 0 8px 24px rgba(59,108,183,.1);
        }

        .verse-card::before {
          content: '"';
          position: absolute; top: -.5rem; left: .75rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem;
          color: var(--blue);
          opacity: .12;
          line-height: 1;
          pointer-events: none;
        }

        .verse-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: .98rem;
          color: var(--text);
          line-height: 1.6;
          opacity: .85;
          position: relative;
        }

        .verse-ref {
          font-size: .6rem;
          color: var(--gold);
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-top: .6rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          opacity: .8;
        }

        /* Hero title */
        .hero-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.6rem, 2.2vw, 2rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.25;
          margin-bottom: .8rem;
          letter-spacing: -.01em;
        }

        .hero-title em {
          font-style: italic;
          background: linear-gradient(90deg, var(--gold), var(--gold2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: .78rem;
          color: var(--textSub);
          line-height: 1.75;
          margin-bottom: 1.75rem;
          max-width: 30ch;
          font-weight: 400;
        }

        /* Pillars */
        .pillars {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: .625rem;
          margin-bottom: 2rem;
        }

        .pillar {
          background: rgba(91,135,208,.08);
          border: 1px solid rgba(139,159,200,.12);
          border-radius: var(--rSm);
          padding: .875rem .75rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: all .3s cubic-bezier(.16,1,.3,1);
          cursor: default;
        }

        .pillar:hover {
          background: rgba(91,135,208,.14);
          border-color: rgba(139,159,200,.2);
          transform: translateY(-2px);
        }

        .pillar-icon {
          font-size: 1.25rem;
          margin-bottom: .35rem;
          display: block;
        }

        .pillar-num {
          font-size: .95rem;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
        }

        .pillar-label {
          font-size: .55rem;
          color: var(--textMuted);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-top: .4rem;
          font-weight: 600;
        }

        /* Ornament wrap */
        .ornament-wrap {
          display: flex; justify-content: center;
          margin-bottom: 2rem;
        }

        /* Demo section */
        .demo-heading {
          font-size: .65rem;
          color: var(--gold);
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .demo-list {
          display: flex; flex-direction: column; gap: .65rem;
          margin-bottom: 1rem;
        }

        .demo-item {
          display: flex; align-items: center; gap: .75rem;
          padding: .75rem .875rem;
          background: rgba(91,135,208,.06);
          border: 1px solid rgba(139,159,200,.12);
          border-radius: var(--rSm);
          cursor: pointer;
          transition: all .2s cubic-bezier(.16,1,.3,1);
          text-align: left;
          flex: 1;
        }

        .demo-item:hover {
          background: rgba(91,135,208,.12);
          border-color: rgba(139,159,200,.2);
          transform: translateX(4px);
        }

        .demo-item.active {
          background: var(--blueDim);
          border-color: rgba(91,135,208,.3);
          box-shadow: 0 0 12px rgba(91,135,208,.15);
        }

        .demo-avatar {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--blue), var(--blue2));
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: .875rem;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
        }

        .demo-info {
          display: flex; flex-direction: column; flex: 1; min-width: 0;
        }

        .demo-role {
          font-size: .75rem; font-weight: 600;
          color: var(--text); line-height: 1.2;
        }

        .demo-email {
          display: block;
          font-size: .63rem; color: var(--textSub);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .demo-badge {
          font-size: .56rem; font-weight: 700;
          padding: .15rem .45rem;
          border-radius: 4px;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--textSub);
          letter-spacing: .04em;
          flex-shrink: 0;
          transition: all .15s cubic-bezier(.16,1,.3,1);
        }

        .demo-item.active .demo-badge {
          background: var(--blueDim);
          border-color: rgba(91,135,208,.3);
          color: var(--blue3);
        }

        .demo-pw {
          margin-top: .7rem;
          font-size: .61rem; color: var(--textFaint);
          display: flex; align-items: center; gap: .35rem;
        }

        .demo-pw kbd {
          font-family: 'Inter', monospace; font-size: .6rem;
          padding: .1rem .4rem;
          border-radius: 4px;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--textSub);
          font-weight: 500;
        }

        /* ══ RIGHT PANEL ══ */
        .right-panel {
          background: var(--surface);
          padding: 3.25rem 3rem;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }

        /* Radial glow top-right */
        .right-panel::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(232,201,122,.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .rp-inner { position: relative; z-index: 1; }

        /* Eyebrow */
        .eyebrow {
          display: inline-flex; align-items: center; gap: .4rem;
          font-size: .61rem; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--gold);
          margin-bottom: .8rem;
        }

        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 8px var(--gold);
          animation: dotPulse 2.5s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--gold); }
          50%       { opacity: .5; box-shadow: 0 0 4px var(--gold); }
        }

        .form-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.15rem; font-weight: 800;
          color: var(--text); line-height: 1.15;
          margin-bottom: .35rem;
          letter-spacing: -.01em;
        }

        .form-sub {
          font-size: .8rem; color: var(--textSub);
          margin-bottom: 2.5rem; line-height: 1.6;
          font-weight: 400;
        }

        /* Fields */
        .field { margin-bottom: 1.1rem; }

        .field-label {
          display: flex; align-items: center; justify-content: space-between;
          font-size: .72rem; font-weight: 600;
          color: rgba(232,236,245,.55);
          margin-bottom: .45rem; letter-spacing: .01em;
          text-transform: uppercase;
        }

        .field-wrap { position: relative; }

        .field-pfx {
          position: absolute; left: .95rem; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px;
          color: var(--textFaint);
          pointer-events: none;
          transition: color .2s cubic-bezier(.16,1,.3,1);
        }

        .field-wrap.focused .field-pfx { color: var(--blue3); }

        .field-input {
          width: 100%;
          padding: .8rem .95rem .8rem 2.55rem;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: var(--rSm);
          font-family: 'Inter', sans-serif;
          font-size: .855rem;
          color: var(--text);
          outline: none;
          transition: all .2s cubic-bezier(.16,1,.3,1);
          font-weight: 500;
        }

        .field-input::placeholder { color: var(--textFaint); }

        .field-input:hover:not(:focus) {
          border-color: rgba(91,135,208,.2);
          background: rgba(20,25,48,.8);
        }

        .field-input:focus {
          border-color: rgba(91,135,208,.45);
          box-shadow: 0 0 0 3px rgba(91,135,208,.1), inset 0 1px 2px rgba(91,135,208,.05);
          background: var(--deep);
        }

        .eye-btn {
          position: absolute; right: .9rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--textMuted);
          display: flex; align-items: center;
          padding: .25rem; border-radius: 4px;
          transition: all .15s cubic-bezier(.16,1,.3,1);
        }
        .eye-btn:hover { color: var(--textSub); background: rgba(91,135,208,.08); }

        /* Submit button */
        .submit-btn {
          width: 100%; margin-top: 1.85rem;
          padding: .85rem 1.5rem;
          background: linear-gradient(135deg, var(--blue) 0%, var(--blue2) 50%, #6fa0d8 100%);
          color: #fff;
          border: none; border-radius: var(--rSm);
          font-family: 'Inter', sans-serif;
          font-size: .88rem; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: var(--shadow-blue), inset 0 1px 0 rgba(255,255,255,.15);
          transition: all .22s cubic-bezier(.16,1,.3,1);
          position: relative; overflow: hidden;
          letter-spacing: .02em;
        }

        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.08));
          opacity: 0; transition: opacity .2s cubic-bezier(.16,1,.3,1);
        }

        .submit-btn:hover:not(:disabled)::after { opacity: 1; }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(91,135,208,.4), inset 0 1px 0 rgba(255,255,255,.2);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        /* Spinner */
        .spin {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spinAnim .55s linear infinite;
        }
        @keyframes spinAnim { to { transform: rotate(360deg); } }

        /* Divider */
        .sep {
          display: flex; align-items: center; gap: .75rem;
          margin: 2rem 0 1.35rem;
          font-size: .61rem; letter-spacing: .12em;
          text-transform: uppercase; color: var(--textFaint);
          font-weight: 600;
        }
        .sep::before, .sep::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Trust row */
        .trust-row { display: flex; gap: .4rem; flex-wrap: wrap; }

        .trust-item {
          display: flex; align-items: center; gap: .3rem;
          padding: .25rem .65rem;
          border-radius: 99px;
          background: rgba(255,255,255,.025);
          border: 1px solid var(--border);
          font-size: .62rem; color: var(--textMuted);
          letter-spacing: .02em;
          font-weight: 500;
          transition: all .2s cubic-bezier(.16,1,.3,1);
        }

        .trust-item:hover {
          background: rgba(91,135,208,.08);
          border-color: rgba(91,135,208,.2);
          color: var(--textSub);
        }

        .trust-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--success); flex-shrink: 0;
        }

        /* Footer */
        .form-footer {
          margin-top: 2.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }

        .footer-brand {
          display: flex; align-items: center; gap: .45rem;
          font-size: .64rem; color: var(--textFaint);
          font-weight: 500;
        }

        .footer-logo {
          width: 20px; height: 20px;
          background: linear-gradient(135deg, var(--blue), var(--blue2));
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
        }

        .footer-version {
          font-size: .62rem; color: var(--textFaint);
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        /* ── Stagger animations ── */
        .stagger { opacity: 0; transform: translateY(10px); }
        .card.in .stagger {
          animation: staggerIn .5s cubic-bezier(.16,1,.3,1) forwards;
        }
        .card.in .s1 { animation-delay: .1s; }
        .card.in .s2 { animation-delay: .18s; }
        .card.in .s3 { animation-delay: .26s; }
        .card.in .s4 { animation-delay: .34s; }
        .card.in .s5 { animation-delay: .42s; }
        .card.in .s6 { animation-delay: .5s; }
        .card.in .s7 { animation-delay: .58s; }

        @keyframes staggerIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Scrollbar */
        .lp-scroll::-webkit-scrollbar { width: 4px; }
        .lp-scroll::-webkit-scrollbar-track { background: transparent; }
        .lp-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; transition: background .2s; }
        .lp-scroll::-webkit-scrollbar-thumb:hover { background: var(--border3); }
      `}</style>

      <div className="lr">
        <div className="lr-bg" aria-hidden="true" />
        <div className="lr-grid" aria-hidden="true" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <Particle key={i} style={{
            width: p.size, height: p.size,
            left: p.left, top: p.top,
            '--delay': p.delay, '--dur': p.duration,
          }} />
        ))}

        <div className={`card ${visible ? 'in' : ''}`}>

          {/* ══ LEFT PANEL ══ */}
          <div className="left-panel">
            <StainedGlass />
            <div className="lp-scroll">

              {/* Brand */}
              <div className="brand stagger s1">
                <div className="brand-mark">
                  <LeafIcon size={20} color="#fff" />
                </div>
                <div>
                  <div className="brand-name">FaithConnect</div>
                  <div className="brand-tagline">Church Management</div>
                </div>
              </div>

              {/* Scripture */}
              <div className="verse-card stagger s2">
                <p className="verse-text">
                  "And let us consider how we may spur one another on toward love and good deeds."
                </p>
                <p className="verse-ref">— Hebrews 10:24</p>
              </div>

              {/* Hero */}
              <h2 className="hero-title stagger s3">
                Serve Together,<br />
                <em>Grow Together.</em>
              </h2>
              <p className="hero-desc stagger s3">
                A unified platform for ministry leaders, coordinators, volunteers, and members — built for community, rooted in faith.
              </p>

              {/* Pillars */}
              <div className="pillars stagger s4">
                {[
                  { icon: '✝', num: '5+',  label: 'Roles' },
                  { icon: '🕊', num: '∞',   label: 'Members' },
                  { icon: '⭐', num: '24/7', label: 'Access' },
                ].map(p => (
                  <div className="pillar" key={p.label}>
                    <span className="pillar-icon">{p.icon}</span>
                    <span className="pillar-num">{p.num}</span>
                    <span className="pillar-label">{p.label}</span>
                  </div>
                ))}
              </div>

              {/* Ornament */}
              <div className="ornament-wrap stagger s4">
                <OrnamDivider />
              </div>

              {/* Demo accounts */}
              <div className="stagger s5">
                <div className="demo-heading">Quick demo access</div>
                <div className="demo-list">
                  {DEMOS.map(d => (
                    <button
                      key={d.email}
                      type="button"
                      className={`demo-item ${activeDemo === d.email ? 'active' : ''}`}
                      onClick={() => fillDemo(d)}
                    >
                      <div className="demo-avatar">{d.icon}</div>
                      <div className="demo-info">
                        <span className="demo-role">{d.role}</span>
                        <span className="demo-email">{d.email}</span>
                      </div>
                      <span className="demo-badge">{d.badge}</span>
                    </button>
                  ))}
                </div>
                <div className="demo-pw">
                  Password: <kbd>Admin@123</kbd>
                </div>
              </div>

            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div className="right-panel">
            <div className="rp-inner">

              <div className="eyebrow stagger s1">
                <span className="eyebrow-dot" />
                Secure portal
              </div>

              <h1 className="form-title stagger s2">Welcome back</h1>
              <p className="form-sub stagger s2">Sign in to your FaithConnect account to continue serving your community.</p>

              <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="field stagger s3">
                  <div className="field-label">
                    <label htmlFor="email">Email address</label>
                  </div>
                  <div className={`field-wrap ${focusedField === 'email' ? 'focused' : ''}`}>
                    <FiMail className="field-pfx" aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="field-input"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@cmems.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field stagger s4">
                  <div className="field-label">
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className={`field-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                    <FiLock className="field-pfx" aria-hidden="true" />
                    <input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      className="field-input"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPwd(p => !p)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn stagger s5"
                >
                  {loading
                    ? <><div className="spin" />Signing in…</>
                    : <>Sign in to FaithConnect <FiArrowRight size={14} /></>
                  }
                </button>
              </form>

              <div className="sep stagger s6">Access security</div>

              <div className="trust-row stagger s6">
                {[
                  { label: 'JWT Auth', icon: <FiShield size={9} /> },
                  { label: 'Role-based access', icon: <FiUsers size={9} /> },
                  { label: 'Encrypted', icon: <FiStar size={9} /> },
                ].map(t => (
                  <span key={t.label} className="trust-item">
                    <span className="trust-dot" />
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="form-footer stagger s7">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <LeafIcon size={11} color="#fff" />
                  </div>
                  FaithConnect v2.0
                </div>
                <div className="footer-version">© 2025 Church Management</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
