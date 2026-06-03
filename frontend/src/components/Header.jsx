import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronDown, FiLogOut, FiUser, FiSettings, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

/* ── Cross icon ── */
function CrossIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="10.5" y="2" width="3" height="20" rx="1.5" fill={color} />
      <rect x="3" y="8.5" width="18" height="3" rx="1.5" fill={color} />
    </svg>
  );
}

/* ── Animated bell ── */
function BellIcon({ ringing }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transformOrigin: '50% 3px', animation: ringing ? 'bellRing .65s ease' : 'none' }}
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

const PAGE_TITLES = {
  '/':           { label: 'Dashboard',       sub: 'Overview & quick stats' },
  '/members':    { label: 'Members',         sub: 'Manage your congregation' },
  '/ministries': { label: 'Ministries',      sub: 'Oversee ministry groups' },
  '/choirs':     { label: 'Choirs',          sub: 'Manage choir members' },
  '/events':     { label: 'Events',          sub: 'Schedule and track events' },
  '/attendance': { label: 'Attendance',      sub: 'Track service attendance' },
  '/volunteers': { label: 'Volunteers',      sub: 'Coordinate volunteers' },
  '/donations':  { label: 'Donations',       sub: 'View financial records' },
  '/reports':    { label: 'Reports',         sub: 'Analytics and insights' },
  '/users':      { label: 'User Management', sub: 'System access control' },
};

const ROLE_STYLES = {
  'Super Administrator': { bg: 'rgba(232,201,122,.12)', color: '#e8c97a', border: 'rgba(232,201,122,.2)' },
  'Ministry Leader':     { bg: 'rgba(91,135,208,.12)',  color: '#7ba3dc', border: 'rgba(91,135,208,.2)' },
  'Choir Coordinator':   { bg: 'rgba(167,139,212,.12)', color: '#a78bd4', border: 'rgba(167,139,212,.2)' },
  'Volunteer':           { bg: 'rgba(107,184,158,.12)', color: '#6bb89e', border: 'rgba(107,184,158,.2)' },
  'Church Member':       { bg: 'rgba(139,168,200,.12)', color: '#8ba8c8', border: 'rgba(139,168,200,.2)' },
};

const MOCK_NOTIFS = [
  { id: 1, text: 'New member registration pending approval', time: '2m ago',  unread: true,  icon: '👤' },
  { id: 2, text: 'Sunday service attendance submitted',      time: '1h ago',  unread: true,  icon: '✅' },
  { id: 3, text: 'Choir practice scheduled for Friday',      time: '3h ago',  unread: false, icon: '♪'  },
  { id: 4, text: 'Monthly donation report is ready',         time: '1d ago',  unread: false, icon: '📊' },
];

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);
  const [notifs,    setNotifs]    = useState(MOCK_NOTIFS);
  const [bellRing,  setBellRing]  = useState(false);

  const notifRef = useRef(null);
  const userRef  = useRef(null);

  const page     = PAGE_TITLES[location.pathname] || { label: 'CMEMS', sub: '' };
  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();
  const rs       = ROLE_STYLES[user?.role] || { bg: 'rgba(139,168,200,.1)', color: '#8ba8c8', border: 'rgba(139,168,200,.15)' };
  const unread   = notifs.filter(n => n.unread).length;

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function openNotifs() {
    setBellRing(true);
    setTimeout(() => setBellRing(false), 700);
    setNotifOpen(o => !o);
    setUserOpen(false);
  }

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, unread: false })));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

        @keyframes bellRing {
          0%,100% { transform: rotate(0deg); }
          15%      { transform: rotate(16deg); }
          30%      { transform: rotate(-13deg); }
          45%      { transform: rotate(9deg); }
          60%      { transform: rotate(-6deg); }
          75%      { transform: rotate(3deg); }
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes badgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .hdr {
          position: sticky; top: 0; z-index: 20;
          background: rgba(11, 14, 23, 0.85);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border-bottom: 1px solid rgba(139,159,200,.1);
          padding: 0 1.25rem;
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem;
          font-family: 'Inter', -apple-system, sans-serif;
          box-shadow: 0 1px 0 rgba(0,0,0,.2);
          -webkit-font-smoothing: antialiased;
        }

        /* ── Left ── */
        .hdr-left {
          display: flex; align-items: center; gap: .75rem;
          min-width: 0;
        }

        .hdr-menu-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(139,159,200,.05);
          border: 1px solid rgba(139,159,200,.1);
          color: #8090b4;
          cursor: pointer;
          transition: all .15s cubic-bezier(.16,1,.3,1);
          flex-shrink: 0;
        }

        .hdr-menu-btn:hover {
          background: rgba(139,159,200,.1);
          color: #e8ecf5;
          border-color: rgba(139,159,200,.2);
        }

        @media (min-width: 1024px) { .hdr-menu-btn { display: none; } }

        .hdr-page { min-width: 0; }

        .hdr-page__title {
          font-size: .88rem; font-weight: 700;
          color: #e8ecf5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          line-height: 1.2; letter-spacing: -0.02em;
        }

        .hdr-page__sub {
          font-size: .63rem; color: #4e5c7e;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: none; margin-top: .05rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em;
        }

        @media (min-width: 480px) { .hdr-page__sub { display: block; } }

        /* ── Right ── */
        .hdr-right {
          display: flex; align-items: center; gap: .25rem;
          flex-shrink: 0;
        }

        .hdr-btn {
          position: relative;
          width: 32px; height: 32px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          color: #4e5c7e;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s cubic-bezier(.16,1,.3,1);
        }

        .hdr-btn:hover {
          background: rgba(139,159,200,.08);
          color: #8090b4;
        }

        .hdr-btn--active {
          background: rgba(139,159,200,.12);
          color: #e8ecf5;
          border-color: rgba(139,159,200,.15);
        }

        /* Unread badge */
        .hdr-badge {
          position: absolute; top: 7px; right: 7px;
          width: 5px; height: 5px;
          background: #e8c97a;
          border-radius: 50%;
          border: 1.5px solid #0b0e17;
          animation: badgePop .3s cubic-bezier(.16,1,.3,1);
          box-shadow: 0 0 8px rgba(232,201,122,.4);
        }

        .hdr-divider {
          width: 1px; height: 16px;
          background: rgba(139,159,200,.1);
          margin: 0 .25rem;
        }

        /* User button */
        .hdr-user-btn {
          display: flex; align-items: center; gap: .5rem;
          padding: .2rem .4rem .2rem .2rem;
          border-radius: 9px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all .15s cubic-bezier(.16,1,.3,1);
        }

        .hdr-user-btn:hover,
        .hdr-user-btn--active {
          background: rgba(139,159,200,.08);
          border-color: rgba(139,159,200,.12);
        }

        .hdr-avatar {
          width: 26px; height: 26px; border-radius: 6px;
          background: linear-gradient(135deg, #3b6cb7, #5a87d0);
          display: flex; align-items: center; justify-content: center;
          font-size: .6rem; font-weight: 800; color: #fff;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.15);
          letter-spacing: -0.02em;
        }

        .hdr-user-name {
          font-size: .78rem; font-weight: 600;
          color: #8090b4;
          white-space: nowrap; display: none;
          letter-spacing: -0.01em;
        }

        @media (min-width: 540px) { .hdr-user-name { display: block; } }

        .hdr-chevron {
          width: 10px; height: 10px;
          color: #2e3850;
          transition: transform .2s; flex-shrink: 0;
          display: none;
        }

        @media (min-width: 540px) { .hdr-chevron { display: block; } }
        .hdr-chevron--open { transform: rotate(180deg); }

        /* ── Dropdown base ── */
        .hdr-drop {
          position: absolute;
          top: calc(100% + 8px); right: 0;
          background: #141929;
          border: 1px solid rgba(139,159,200,.15);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,.5);
          z-index: 100;
          animation: dropIn .2s cubic-bezier(.16,1,.3,1);
          overflow: hidden;
        }

        /* ── Notification dropdown ── */
        .notif-drop { width: 300px; }

        .notif-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: .85rem 1rem .75rem;
          border-bottom: 1px solid rgba(139,159,200,.08);
        }

        .notif-head__title {
          font-size: .75rem; font-weight: 800;
          color: #e8ecf5; letter-spacing: -0.01em;
        }

        .notif-head__count {
          font-size: .55rem; font-weight: 900;
          padding: .12rem .4rem; border-radius: 4px;
          background: rgba(232,201,122,.1);
          color: #e8c97a;
          letter-spacing: .05em; text-transform: uppercase;
        }

        .notif-mark-btn {
          font-size: .63rem; font-weight: 700;
          color: #3b6cb7;
          background: none; border: none; cursor: pointer;
          font-family: inherit;
          padding: .2rem .4rem; border-radius: 4px;
          transition: all .15s;
          text-transform: uppercase; letter-spacing: 0.04em;
        }

        .notif-mark-btn:hover { color: #5a87d0; background: rgba(59,108,183,.08); }

        .notif-list { max-height: 260px; overflow-y: auto; }
        .notif-list::-webkit-scrollbar { width: 3px; }
        .notif-list::-webkit-scrollbar-thumb { background: rgba(139,159,200,.1); border-radius: 2px; }

        .notif-item {
          display: flex; align-items: flex-start; gap: .7rem;
          padding: .75rem 1rem;
          border-bottom: 1px solid rgba(139,159,200,.05);
          transition: background .15s; cursor: default;
        }

        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: rgba(139,159,200,.03); }
        .notif-item--unread { background: rgba(59,108,183,.03); }

        .notif-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(139,159,200,.06);
          display: flex; align-items: center; justify-content: center;
          font-size: .75rem; flex-shrink: 0;
        }

        .notif-text {
          font-size: .72rem; line-height: 1.45;
          color: #8090b4;
          font-weight: 500; flex: 1;
        }

        .notif-item--unread .notif-text { color: #e8ecf5; font-weight: 600; }

        .notif-time {
          font-size: .58rem; color: #2e3850;
          margin-top: .25rem; font-weight: 700;
        }

        .notif-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #3b6cb7; flex-shrink: 0; margin-top: .4rem;
        }

        .notif-footer {
          padding: .65rem 1rem;
          background: rgba(139,159,200,.02);
          border-top: 1px solid rgba(139,159,200,.05);
          display: flex; align-items: center; justify-content: center; gap: .4rem;
          font-size: .6rem; color: #2e3850;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
        }

        /* ── User dropdown ── */
        .user-drop { width: 220px; }

        .user-drop__profile {
          padding: 1rem;
          border-bottom: 1px solid rgba(139,159,200,.08);
        }

        .user-drop__avatar-row {
          display: flex; align-items: center; gap: .75rem;
          margin-bottom: .75rem;
        }

        .user-drop__av {
          width: 36px; height: 36px; border-radius: 8px;
          background: linear-gradient(135deg, #3b6cb7, #5a87d0);
          display: flex; align-items: center; justify-content: center;
          font-size: .8rem; font-weight: 800; color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.15);
        }

        .user-drop__name {
          font-size: .82rem; font-weight: 700;
          color: #e8ecf5; line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .user-drop__email {
          font-size: .65rem; color: #4e5c7e;
          margin-top: .1rem; overflow: hidden; text-overflow: ellipsis;
          font-weight: 500;
        }

        .user-drop__role {
          display: inline-block;
          font-size: .55rem; font-weight: 900;
          padding: 1px 6px; border-radius: 4px;
          letter-spacing: .05em; text-transform: uppercase;
          border: 1px solid transparent;
        }

        .user-drop__menu { padding: .4rem; }

        .user-drop__item {
          display: flex; align-items: center; gap: .65rem;
          width: 100%; padding: .55rem .75rem;
          border-radius: 8px;
          background: transparent; border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: .75rem; font-weight: 600;
          color: #8090b4;
          transition: all .12s cubic-bezier(.16,1,.3,1);
          text-align: left;
          letter-spacing: -0.01em;
        }

        .user-drop__item:hover {
          background: rgba(139,159,200,.08);
          color: #e8ecf5;
        }

        .user-drop__item svg { width: 13px; height: 13px; color: #2e3850; }
        .user-drop__item:hover svg { color: #3b6cb7; }

        .user-drop__sep {
          height: 1px; background: rgba(139,159,200,.08);
          margin: .3rem .75rem;
        }

        .user-drop__item--danger:hover { background: rgba(217,96,96,.08); color: #f87171; }
        .user-drop__item--danger:hover svg { color: #f87171; }
      `}</style>

      <header className="hdr" role="banner">
        <div className="hdr-left">
          <button className="hdr-menu-btn" onClick={onMenuClick} aria-label="Toggle navigation menu">
            <FiMenu size={16} />
          </button>

          <div className="hdr-page">
            <h1 className="hdr-page__title">{page.label}</h1>
            <p className="hdr-page__sub">{page.sub}</p>
          </div>
        </div>

        <div className="hdr-right">

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className={`hdr-btn${notifOpen ? ' hdr-btn--active' : ''}`}
              onClick={openNotifs}
              aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
            >
              <BellIcon ringing={bellRing} />
              {unread > 0 && <span className="hdr-badge" aria-hidden="true" />}
            </button>

            {notifOpen && (
              <div className="hdr-drop notif-drop" role="dialog" aria-label="Notifications">
                <div className="notif-head">
                  <span className="notif-head__title">Notifications</span>
                  {unread > 0 && <button className="notif-mark-btn" onClick={markAllRead}>Mark all read</button>}
                </div>

                <div className="notif-list">
                  {notifs.map(n => (
                    <div key={n.id} className={`notif-item${n.unread ? ' notif-item--unread' : ''}`}>
                      <div className="notif-icon">{n.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                      {n.unread && <div className="notif-dot" />}
                    </div>
                  ))}
                </div>

                <div className="notif-footer">
                  <CrossIcon size={8} color="#2e3850" />
                  {unread === 0 ? 'All caught up' : `${unread} new`}
                </div>
              </div>
            )}
          </div>

          <div className="hdr-divider" />

          {/* User menu */}
          <div style={{ position: 'relative' }} ref={userRef}>
            <button
              className={`hdr-user-btn${userOpen ? ' hdr-user-btn--active' : ''}`}
              onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}
              aria-label="User menu"
              aria-expanded={userOpen}
            >
              <div className="hdr-avatar">{initials}</div>
              <span className="hdr-user-name">{user?.first_name}</span>
              <FiChevronDown className={`hdr-chevron${userOpen ? ' hdr-chevron--open' : ''}`} />
            </button>

            {userOpen && (
              <div className="hdr-drop user-drop" role="dialog" aria-label="User menu">
                <div className="user-drop__profile">
                  <div className="user-drop__avatar-row">
                    <div className="user-drop__av">{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="user-drop__name">{user?.first_name} {user?.last_name}</div>
                      <div className="user-drop__email">{user?.email}</div>
                    </div>
                  </div>
                  <span className="user-drop__role" style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}>
                    {user?.role}
                  </span>
                </div>

                <div className="user-drop__menu">
                  <button className="user-drop__item"><FiUser /> My Profile</button>
                  <button className="user-drop__item"><FiSettings /> Preferences</button>
                  <div className="user-drop__sep" />
                  <button className="user-drop__item user-drop__item--danger" onClick={logout}><FiLogOut /> Sign out</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}