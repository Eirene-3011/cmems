import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiX, FiShield, FiLock, FiUsers, FiUserCheck, 
  FiSearch, FiCalendar, FiActivity, FiUserPlus 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', sky:'#3b82f6', ice:'#93c5fd',
  gold:'#d97706', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const ROLES = [
  { id:1, name:'Super Administrator' },
  { id:2, name:'Ministry Leader' },
  { id:3, name:'Choir Coordinator' },
  { id:4, name:'Volunteer' },
  { id:5, name:'Church Member' },
];

const inputStyle = {
  width:'100%', background: C.lift, border:`1px solid ${C.border2}`, borderRadius:10,
  padding:'10px 14px', color: C.text, fontSize:14, outline:'none', boxSizing:'border-box',
  transition: 'all 0.2s ease',
};

const labelStyle = { 
  fontSize:11, fontWeight:700, color: C.sub, display:'block', 
  marginBottom:6, letterSpacing:'.06em', textTransform:'uppercase' 
};

const selectStyle = { ...inputStyle, cursor:'pointer' };

function Badge({ children, color }) {
  const map = {
    green:  { bg:'rgba(5,150,105,.12)', color:'#34d399', border:'rgba(5,150,105,.2)' },
    red:    { bg:'rgba(225,29,72,.12)',  color:'#fb7185', border:'rgba(225,29,72,.2)' },
    gray:   { bg:'rgba(120,150,210,.08)', color: C.sub,   border: C.border },
    blue:   { bg:'rgba(37,99,235,.12)',  color:'#93c5fd', border:'rgba(37,99,235,.2)' },
    gold:   { bg:'rgba(217,119,6,.12)',   color:'#fcd34d', border:'rgba(217,119,6,.2)' },
    violet: { bg:'rgba(124,58,237,.12)',  color:'#c4b5fd', border:'rgba(124,58,237,.2)' },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{ 
      padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, 
      border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, 
      letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' 
    }}>
      {children}
    </span>
  );
}

function RoleBadge({ role }) {
  const colorMap = {
    'Super Administrator': 'gold',
    'Ministry Leader':     'blue',
    'Choir Coordinator':   'violet',
    'Volunteer':           'green',
    'Church Member':       'gray',
  };
  return <Badge color={colorMap[role]}>{role}</Badge>;
}

function Avatar({ name, size = 36 }) {
  const initials = (name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '10px', 
      background: `linear-gradient(135deg, ${C.lift}, ${C.slate})`,
      border: `1px solid ${C.border2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C.sky, fontSize: size * 0.4, fontWeight: 700,
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

function GlassOrb({ color, size=200, style }) {
  return (
    <div style={{ 
      position:'absolute', width:size, height:size, borderRadius:'50%', 
      background:`radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`, 
      filter:'blur(60px)', pointerEvents:'none', ...style 
    }} aria-hidden="true" />
  );
}

export default function Users() {
  const { user }            = useAuth();
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { 
      const r = await api.get('/dashboard/users'); 
      setUsers(r.data.data); 
    } catch {
      toast.error('Failed to load users.');
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { load(); }, []);

  if (user?.role !== 'Super Administrator') {
    return (
      <div style={{ minHeight:'100vh', background: C.obsidian, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Inter", system-ui, sans-serif' }}>
        <GlassOrb color="#e11d48" size={400} style={{ top:'20%', left:'20%', opacity:0.3 }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ width:80, height:80, borderRadius:24, background:C.panel, border:`1px solid ${C.border2}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
            <FiLock size={32} style={{ color: C.rose }} />
          </div>
          <h2 style={{ color: C.text, fontSize:24, fontWeight:800, margin:'0 0 8px 0' }}>Access Restricted</h2>
          <p style={{ color: C.sub, fontSize:15, maxWidth:300, margin:'0 auto', lineHeight:1.6 }}>This administrative module is only accessible to Super Administrators.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cmems-page" style={{ 
      minHeight:'100vh', background: C.obsidian, margin:'-24px', 
      padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden',
      fontFamily:'"Inter", system-ui, sans-serif' 
    }}>
      <GlassOrb color="#d97706" size={500} style={{ top:-150, right:-100, opacity:0.5 }} />
      <GlassOrb color="#7c3aed" size={400} style={{ bottom:-50, left:-100, opacity:0.3 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Administration Module
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              User <span style={{ color: C.gold }}>Management</span>
            </h1>
          </div>
          
          <div className="cmems-header-actions" style={{ display:'flex', gap:12 }}>
            <div className="cmems-search-box" style={{ position:'relative', width:300 }}>
              <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.muted }} size={16} />
              <input
                style={{ ...inputStyle, paddingLeft:42, background:C.panel, borderColor:C.border }}
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button onClick={() => setModal(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg, #1a4fa0, ${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
              <FiUserPlus size={18} /> Add User
            </button>
          </div>
        </header>

        {/* Stats Summary */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20, marginBottom:32 }}>
          {[
            { label:'Total Users', value: users.length, icon:<FiUsers color={C.sky}/> },
            { label:'Administrators', value: users.filter(u=>u.role.includes('Admin')).length, icon:<FiShield color={C.gold2}/> },
            { label:'Active Users', value: users.filter(u=>u.status==='Active').length, icon:<FiUserCheck color={C.emerald}/> },
            { label:'Recent Activity', value: 'Live', icon:<FiActivity color={C.rose}/> }
          ].map((stat, i) => (
            <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize:11, color: C.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em' }}>{stat.label}</div>
                <div style={{ fontSize:20, color: C.text, fontWeight:800 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Container */}
        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,.3)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {[
                    { label:'#', width:'60px' },
                    { label:'User Identity', width:'35%' },
                    { label:'Email Address', width:'25%' },
                    { label:'Role Access', width:'20%' },
                    { label:'Status', width:'10%' },
                    { label:'Joined Date', width:'10%' }
                  ].map((h, i) => (
                    <th key={i} style={{ 
                      padding:'16px 24px', textAlign:'left', color: C.sub, fontWeight:800, fontSize:10, 
                      letterSpacing:'.1em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`,
                      width: h.width
                    }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign:'center', padding:80 }}>
                      <div style={{ display:'inline-block', width:30, height:30, border:`3px solid ${C.border}`, borderTopColor:C.sky, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                      <p style={{ marginTop:16, color: C.muted, fontSize:14 }}>Fetching user records...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign:'center', padding:80, color: C.muted }}>No users found.</td>
                  </tr>
                ) : filteredUsers.map((u, i) => (
                  <tr key={u.id} style={{ transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}`, color: C.muted, fontSize:12, fontWeight:600 }}>{i+1}</td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <Avatar name={u.first_name} />
                        <div>
                          <div style={{ color: C.text, fontWeight:700, fontSize:14 }}>{u.first_name} {u.last_name}</div>
                          <div style={{ color: C.muted, fontSize:11, marginTop:2 }}>ID: #{u.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}`, color: C.sub, fontSize:13 }}>{u.email}</td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <RoleBadge role={u.role} />
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <Badge color={u.status === 'Active' ? 'green' : 'red'}>{u.status}</Badge>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}`, color: C.muted, fontSize:12, whiteSpace:'nowrap' }}>
                      {new Date(u.created_at).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'16px 24px', background: 'rgba(0,0,0,0.1)', color: C.muted, fontSize:12, fontWeight:600, display:'flex', justifyContent:'space-between' }}>
            <span>Showing {filteredUsers.length} of {users.length} users</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {modal && (
        <RegisterModal onSave={async form => {
          try { 
            await api.post('/auth/register', form); 
            toast.success('User registered successfully.'); 
            load(); 
            setModal(false); 
          } catch(e) { 
            toast.error(e.response?.data?.message || 'Error creating user.'); 
          }
        }} onClose={() => setModal(false)} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${C.obsidian}; }
        ::-webkit-scrollbar-thumb { background: ${C.lift}; borderRadius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.slate}; }
      `}</style>
    </div>
  );
}

function RegisterModal({ onSave, onClose }) {
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', password:'', role_id:5 });
  const set = f => setForm(p => ({ ...p, ...f }));

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, width:'100%', maxWidth:480, boxShadow:'0 32px 80px rgba(0,0,0,.8)', position:'relative', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>Add New User</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Create a new administrative or member account</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ padding:'32px', display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div><label style={labelStyle}>First Name *</label><input style={inputStyle} value={form.first_name} onChange={e=>set({first_name:e.target.value})} /></div>
            <div><label style={labelStyle}>Last Name *</label><input style={inputStyle} value={form.last_name} onChange={e=>set({last_name:e.target.value})} /></div>
          </div>
          <div><label style={labelStyle}>Email Address *</label><input type="email" style={inputStyle} value={form.email} onChange={e=>set({email:e.target.value})} /></div>
          <div><label style={labelStyle}>Password *</label><input type="password" style={inputStyle} value={form.password} onChange={e=>set({password:e.target.value})} /></div>
          <div><label style={labelStyle}>Access Role *</label>
            <select style={selectStyle} value={form.role_id} onChange={e=>set({role_id:parseInt(e.target.value)})}>
              {ROLES.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg, #1a4fa0, ${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>
            Register User
          </button>
        </div>
      </div>
    </div>
  );
}