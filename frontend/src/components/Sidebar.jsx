import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome, FiUsers, FiBookOpen, FiMusic, FiCalendar,
  FiCheckSquare, FiHeart, FiDollarSign, FiBarChart2,
  FiSettings, FiLogOut, FiChevronRight
} from 'react-icons/fi';

/* ── Cross Icon ── */
function CrossIcon({ size = 20, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <rect x="10.5" y="2" width="3" height="20" rx="1.5" fill={color} />
      <rect x="3" y="8.5" width="18" height="3" rx="1.5" fill={color} />
    </svg>
  );
}

/* ── Geometric watermark — refined arch ── */
function ArchWatermark() {
  return (
    <svg
      style={{
        position: 'absolute', bottom: 50, right: -30,
        width: 140, height: 175, opacity: .04,
        pointerEvents: 'none', zIndex: 0
      }}
      viewBox="0 0 140 175"
      fill="none"
      aria-hidden="true"
    >
      <path d="M15 170 L15 72 Q15 12 70 8 Q125 12 125 72 L125 170 Z" stroke="#c9a84c" strokeWidth="1.5" />
      <path d="M28 160 L28 76 Q28 28 70 24 Q112 28 112 76 L112 160 Z" stroke="#4a7fd4" strokeWidth="1" />
      <rect x="65" y="42" width="10" height="52" rx="2" fill="#c9a84c" opacity=".35" />
      <rect x="48" y="60" width="44" height="9" rx="2" fill="#c9a84c" opacity=".35" />
      <circle cx="70" cy="40" r="10" stroke="#4a7fd4" strokeWidth="1" fill="none" opacity=".5" />
      <line x1="15" y1="114" x2="125" y2="114" stroke="#8b9fc8" strokeWidth=".5" strokeDasharray="3 6" opacity=".5" />
      <line x1="15" y1="140" x2="125" y2="140" stroke="#8b9fc8" strokeWidth=".5" strokeDasharray="3 6" opacity=".5" />
    </svg>
  );
}

const nav = [
  { to: '/',           label: 'Dashboard',   icon: FiHome,        roles: ['all'],                                           group: 'main'   },
  { to: '/members',    label: 'Members',     icon: FiUsers,       roles: ['all'],                                           group: 'main'   },
  { to: '/ministries', label: 'Ministries',  icon: FiBookOpen,    roles: ['all'],                                           group: 'main'   },
  { to: '/choirs',     label: 'Choirs',      icon: FiMusic,       roles: ['all'],                                           group: 'main'   },
  { to: '/events',     label: 'Events',      icon: FiCalendar,    roles: ['all'],                                           group: 'main'   },
  { to: '/attendance', label: 'Attendance',  icon: FiCheckSquare, roles: ['all'],                                           group: 'main'   },
  { to: '/volunteers', label: 'Volunteers',  icon: FiHeart,       roles: ['Super Administrator', 'Ministry Leader'],        group: 'manage' },
  { to: '/donations',  label: 'Donations',   icon: FiDollarSign,  roles: ['Super Administrator'],                           group: 'manage' },
  { to: '/reports',    label: 'Reports',     icon: FiBarChart2,   roles: ['Super Administrator', 'Ministry Leader'],        group: 'manage' },
  { to: '/users',      label: 'Users',       icon: FiSettings,    roles: ['Super Administrator'],                           group: 'admin'  },
];

const GROUP_LABELS = {
  main:   'Navigation',
  manage: 'Management',
  admin:  'Administration',
};

const ROLE_STYLES = {
  'Super Administrator': { bg: 'rgba(201,168,76,.14)',  color: '#c9a84c', border: 'rgba(201,168,76,.28)'  },
  'Ministry Leader':     { bg: 'rgba(74,127,212,.14)',  color: '#6b9fe8', border: 'rgba(74,127,212,.28)'  },
  'Choir Coordinator':   { bg: 'rgba(155,126,219,.14)', color: '#b89ee0', border: 'rgba(155,126,219,.28)' },
  'Volunteer':           { bg: 'rgba(90,171,142,.14)',  color: '#5aab8e', border: 'rgba(90,171,142,.28)'  },
  'Church Member':       { bg: 'rgba(107,143,199,.12)', color: '#7a9ec7', border: 'rgba(107,143,199,.24)' },
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const items = nav.filter(n => n.roles.includes('all') || n.roles.includes(user?.role));
  const groups = [...new Set(items.map(i => i.group))];

  const rs = ROLE_STYLES[user?.role] || { bg: 'rgba(107,143,199,.1)', color: '#7a9ec7', border: 'rgba(107,143,199,.2)' };
  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

        :root {
          --sb-night:   #060912;
          --sb-deep:    #0a0f1e;
          --sb-panel:   #0d1322;
          --sb-surface: #111825;
          --sb-lift:    #161e30;
          --sb-card:    #1a2236;
          --sb-border:  rgba(106,134,190,.1);
          --sb-border2: rgba(106,134,190,.17);
          --sb-gold:    #c9a84c;
          --sb-gold2:   #e8c97a;
          --sb-blue:    #2d5fa8;
          --sb-blue2:   #4a7fd4;
          --sb-blue3:   #6b9fe8;
          --sb-text:    #e4e9f5;
          --sb-sub:     #7a8eae;
          --sb-muted:   #3d4e6e;
          --sb-faint:   #22304a;
          --sb-danger:  #d96060;
          --sb-success: #5aab8e;
          --sb-w:       256px;
          --sb-trans:   all .2s cubic-bezier(.16,1,.3,1);
          --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* ── Shell ── */
        .sb {
          position: fixed;
          top: 0; left: 0; height: 100%;
          width: var(--sb-w);
          background: var(--sb-panel);
          display: flex; flex-direction: column;
          z-index: 40;
          transition: transform .3s cubic-bezier(.16,1,.3,1);
          font-family: var(--font-inter);
          border-right: 1px solid var(--sb-border);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Ambient left glow */
        .sb::before {
          content: '';
          position: absolute; top: -100px; left: -60px;
          width: 260px; height: 320px;
          background: radial-gradient(circle, rgba(45,95,168,.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* Top gradient accent */
        .sb::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--sb-blue2) 40%, var(--sb-gold) 80%, transparent);
          opacity: .5; z-index: 2;
        }

        .sb--closed { transform: translateX(-100%); }
        .sb--open   { transform: translateX(0); }

        @media (min-width: 1024px) {
          .sb { transform: translateX(0) !important; }
        }

        /* ── Overlay ── */
        .sb-overlay {
          position: fixed; inset: 0;
          background: rgba(6,9,18,.7);
          z-index: 30;
          backdrop-filter: blur(4px);
          animation: sbFade .22s ease;
        }

        @keyframes sbFade { from { opacity: 0; } to { opacity: 1; } }

        /* ── Brand ── */
        .sb-brand {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: .9rem;
          padding: 1.5rem 1.25rem 1.35rem;
          border-bottom: 1px solid var(--sb-border);
          flex-shrink: 0; text-decoration: none;
          transition: var(--sb-trans);
        }

        .sb-brand__mark {
          width: 42px; height: 42px;
          background: linear-gradient(150deg, var(--sb-blue) 0%, var(--sb-blue2) 100%);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 18px rgba(74,127,212,.3), inset 0 1px 0 rgba(255,255,255,.13);
          position: relative; transition: var(--sb-trans);
        }

        .sb-brand__mark:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(74,127,212,.4), inset 0 1px 0 rgba(255,255,255,.18);
        }

        .sb-brand__mark::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.1);
        }

        .sb-brand__name {
          font-size: 1.38rem; font-weight: 900;
          color: var(--sb-text);
          letter-spacing: -0.04em; line-height: 1;
        }

        .sb-brand__sub {
          font-size: .59rem; color: var(--sb-muted);
          letter-spacing: .16em; text-transform: uppercase;
          margin-top: .22rem; font-weight: 800;
        }

        /* ── Nav ── */
        .sb-nav {
          position: relative; z-index: 1;
          flex: 1; overflow-y: auto;
          padding: 1.1rem .75rem 1rem;
          scrollbar-width: thin;
          scrollbar-color: var(--sb-border) transparent;
        }

        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb { background: var(--sb-border); border-radius: 2px; }

        /* ── Group ── */
        .sb-group { margin-bottom: .25rem; }
        .sb-group + .sb-group { margin-top: 1.4rem; }

        .sb-group__label {
          font-size: .57rem; font-weight: 900;
          letter-spacing: .18em; text-transform: uppercase;
          color: var(--sb-faint);
          padding: 0 .65rem; margin-bottom: .45rem;
          display: flex; align-items: center; gap: .5rem;
        }

        .sb-group__label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--sb-border), transparent);
        }

        /* ── Nav item ── */
        .sb-item {
          display: flex; align-items: center; gap: .7rem;
          padding: .65rem .85rem;
          border-radius: 11px;
          text-decoration: none;
          font-size: .8rem; font-weight: 700;
          color: var(--sb-muted);
          position: relative; transition: var(--sb-trans);
          margin-bottom: .18rem;
          border: 1px solid transparent;
          overflow: hidden; white-space: nowrap;
          letter-spacing: -0.01em;
        }

        /* Shimmer sweep on hover */
        .sb-item::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.025), transparent);
          transform: skewX(-18deg);
          transition: left .5s;
          pointer-events: none;
        }

        .sb-item:hover::before { left: 150%; }

        .sb-item:hover {
          background: var(--sb-surface);
          color: var(--sb-text);
          border-color: var(--sb-border);
          transform: translateX(4px);
        }

        .sb-item:hover .sb-item__icon { color: var(--sb-blue3); }
        .sb-item:hover .sb-item__arrow { opacity: 1; transform: translateX(0); color: var(--sb-blue3); }

        /* Active state */
        .sb-item--active {
          background: linear-gradient(135deg, rgba(45,95,168,.18) 0%, rgba(17,24,37,.95) 100%);
          color: var(--sb-text) !important;
          border-color: rgba(74,127,212,.22) !important;
          box-shadow: 0 2px 14px rgba(45,95,168,.14);
          transform: translateX(4px);
        }

        .sb-item--active .sb-item__icon { color: var(--sb-gold) !important; }
        .sb-item--active .sb-item__arrow { opacity: 1; transform: translateX(0); color: var(--sb-gold); }

        /* Active left accent bar */
        .sb-item--active::after {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: linear-gradient(180deg, var(--sb-gold), var(--sb-blue2));
          border-radius: 0 3px 3px 0;
        }

        .sb-item__icon {
          width: 15px; height: 15px; flex-shrink: 0;
          color: var(--sb-faint); transition: color .18s;
        }

        .sb-item__label { flex: 1; }

        .sb-item__arrow {
          width: 11px; height: 11px;
          color: var(--sb-muted); opacity: 0;
          transform: translateX(-6px);
          transition: var(--sb-trans); flex-shrink: 0;
        }

        /* ── Footer ── */
        .sb-footer {
          position: relative; z-index: 1;
          flex-shrink: 0;
          border-top: 1px solid var(--sb-border);
          padding: .9rem .75rem;
        }

        .sb-user {
          display: flex; align-items: center; gap: .7rem;
          padding: .65rem .75rem;
          border-radius: 12px; margin-bottom: .45rem;
          background: var(--sb-surface);
          border: 1px solid var(--sb-border);
          transition: var(--sb-trans);
          cursor: default;
        }

        .sb-user:hover { border-color: var(--sb-border2); background: var(--sb-lift); transform: translateY(-2px); }

        .sb-avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--sb-blue), var(--sb-blue2));
          display: flex; align-items: center; justify-content: center;
          font-size: .69rem; font-weight: 900; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(74,127,212,.35);
          letter-spacing: -0.02em;
        }

        .sb-user__info { flex: 1; min-width: 0; }

        .sb-user__name {
          font-size: .79rem; font-weight: 800;
          color: var(--sb-text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .sb-user__role {
          display: inline-block; margin-top: .24rem;
          font-size: .57rem; font-weight: 900;
          padding: 2px 7px; border-radius: 5px;
          letter-spacing: .06em;
          border: 1px solid transparent;
          text-transform: uppercase;
        }

        .sb-logout {
          display: flex; align-items: center; gap: .6rem;
          width: 100%; padding: .58rem .8rem;
          border-radius: 10px;
          background: transparent; border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: .78rem; font-weight: 700;
          color: var(--sb-muted);
          transition: var(--sb-trans);
          text-align: left;
          letter-spacing: -0.01em;
        }

        .sb-logout:hover {
          background: rgba(217,96,96,.07);
          color: var(--sb-danger);
          transform: translateX(4px);
        }

        .sb-logout:hover .sb-logout-icon { color: var(--sb-danger); }

        .sb-logout-icon {
          width: 14px; height: 14px;
          color: var(--sb-faint); flex-shrink: 0;
          transition: color .18s;
        }

        /* Status dot */
        .sb-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--sb-success);
          box-shadow: 0 0 5px rgba(90,171,142,.5);
          flex-shrink: 0; margin-left: auto;
        }

        /* Item entry animation */
        @keyframes sbItemIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .sb-nav .sb-item {
          animation: sbItemIn .4s cubic-bezier(.16,1,.3,1) both;
        }
      `}</style>

      {/* Mobile overlay */}
      {open && (
        <div className="sb-overlay lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sb ${open ? 'sb--open' : 'sb--closed'}`} aria-label="Main navigation">
        <ArchWatermark />

        {/* ── Brand ── */}
        <div className="sb-brand">
          <div className="sb-brand__mark">
            <CrossIcon size={20} color="#fff" />
          </div>
          <div>
            <div className="sb-brand__name">FaithConnect</div>
            <div className="sb-brand__sub">Church Management</div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="sb-nav">
          {groups.map(group => {
            const groupItems = items.filter(i => i.group === group);
            return (
              <div key={group} className="sb-group">
                <div className="sb-group__label">{GROUP_LABELS[group]}</div>
                {groupItems.map(({ to, label, icon: Icon }, idx) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                    style={{ animationDelay: `${idx * 38}ms` }}
                    className={({ isActive }) =>
                      `sb-item${isActive ? ' sb-item--active' : ''}`
                    }
                    aria-current={location.pathname === to ? 'page' : undefined}
                  >
                    <Icon className="sb-item__icon" aria-hidden="true" />
                    <span className="sb-item__label">{label}</span>
                    <FiChevronRight className="sb-item__arrow" aria-hidden="true" />
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* ── User footer ── */}
        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user__info">
              <div className="sb-user__name">{user?.first_name} {user?.last_name}</div>
              <span
                className="sb-user__role"
                style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}
              >
                {user?.role}
              </span>
            </div>
            <div className="sb-status-dot" title="Online" />
          </div>

          <button className="sb-logout" onClick={logout} aria-label="Sign out">
            <FiLogOut className="sb-logout-icon" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}