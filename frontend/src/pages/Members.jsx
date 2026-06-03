import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUsers, FiMail, FiPhone, FiCalendar, FiMoreHorizontal, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', sky:'#3b82f6', ice:'#93c5fd',
  gold:'#d97706', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const EMPTY = { first_name:'', middle_name:'', last_name:'', gender:'Male', birthdate:'', contact_number:'', email:'', address:'', date_joined:'', status:'Active' };

const inputStyle = {
  width:'100%', background: C.lift, border:`1px solid ${C.border2}`, borderRadius:10,
  padding:'10px 14px', color: C.text, fontSize:14, outline:'none', boxSizing:'border-box',
  transition: 'all 0.2s cubic-bezier(.16,1,.3,1)', fontFamily:'"Inter", system-ui, sans-serif',
  fontWeight: 500,
};
const labelStyle = { fontSize:11, fontWeight:700, color: C.sub, display:'block', marginBottom:6, letterSpacing:'.06em', textTransform:'uppercase', fontFamily:'"Inter", system-ui, sans-serif' };
const selectStyle = { ...inputStyle, cursor:'pointer' };

function Badge({ children, color }) {
  const map = {
    green: { bg:'rgba(5,150,105,.12)', color:'#34d399', border:'rgba(5,150,105,.2)' },
    red:   { bg:'rgba(225,29,72,.12)',  color:'#fb7185', border:'rgba(225,29,72,.2)' },
    gray:  { bg:'rgba(120,150,210,.08)', color: C.sub,   border: C.border },
    blue:  { bg:'rgba(37,99,235,.12)',  color:'#93c5fd', border:'rgba(37,99,235,.2)' },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase', fontFamily:'"Inter", system-ui, sans-serif' }}>
      {children}
    </span>
  );
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '10px', 
      background: `linear-gradient(135deg, ${C.lift}, ${C.slate})`,
      border: `1px solid ${C.border2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C.sky, fontSize: size * 0.4, fontWeight: 700,
      flexShrink: 0, fontFamily:'"Inter", system-ui, sans-serif'
    }}>
      {initials}
    </div>
  );
}

function GlassOrb({ color, size=200, style }) {
  return (
    <div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`, filter:'blur(60px)', pointerEvents:'none', ...style }} aria-hidden="true" />
  );
}

function Modal({ member, onSave, onClose }) {
  const [form, setForm] = useState(member || EMPTY);
  const set = f => setForm(p => ({ ...p, ...f }));

  async function submit(e) {
    e.preventDefault();
    try {
      if (member?.id) await api.put(`/members/${member.id}`, form);
      else            await api.post('/members', form);
      toast.success(member?.id ? 'Member updated.' : 'Member added.');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving member.'); }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fadeIn .2s ease-out' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, width:'100%', maxWidth:600, maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,.8)', position:'relative', overflow:'hidden', animation:'slideUp .3s cubic-bezier(.16,1,.3,1)' }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0, fontFamily:'"Inter", system-ui, sans-serif', letterSpacing:'-0.01em' }}>{member?.id ? 'Update Profile' : 'New Member'}</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0', fontFamily:'"Inter", system-ui, sans-serif', fontWeight:500 }}>{member?.id ? 'Modify existing member information' : 'Register a new member to the database'}</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex', transition:'all .2s cubic-bezier(.16,1,.3,1)' }} onMouseEnter={e => { e.currentTarget.style.background = C.slate; e.currentTarget.style.color = C.text; }} onMouseLeave={e => { e.currentTarget.style.background = C.lift; e.currentTarget.style.color = C.sub; }}><FiX size={18} /></button>
        </div>
        
        <form id="member-form" onSubmit={submit} style={{ overflowY:'auto', padding:'32px', display:'flex', flexDirection:'column', gap:20 }}>
          <section>
            <h4 style={{ fontSize:10, color: C.gold2, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:16, fontWeight:800, fontFamily:'"Inter", system-ui, sans-serif' }}>Personal Information</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div><label style={labelStyle}>First Name *</label><input style={inputStyle} required value={form.first_name} onChange={e=>set({first_name:e.target.value})} /></div>
              <div><label style={labelStyle}>Last Name *</label><input style={inputStyle} required value={form.last_name} onChange={e=>set({last_name:e.target.value})} /></div>
            </div>
            <div style={{ marginTop:16 }}><label style={labelStyle}>Middle Name</label><input style={inputStyle} value={form.middle_name} onChange={e=>set({middle_name:e.target.value})} /></div>
          </section>

          <section>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div><label style={labelStyle}>Gender *</label>
                <select style={selectStyle} required value={form.gender} onChange={e=>set({gender:e.target.value})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div><label style={labelStyle}>Birthdate</label><input type="date" style={inputStyle} value={form.birthdate||''} onChange={e=>set({birthdate:e.target.value})} /></div>
            </div>
          </section>

          <section>
            <h4 style={{ fontSize:10, color: C.gold2, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:16, fontWeight:800, fontFamily:'"Inter", system-ui, sans-serif' }}>Contact & Status</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div><label style={labelStyle}>Contact Number</label><input style={inputStyle} value={form.contact_number||''} onChange={e=>set({contact_number:e.target.value})} /></div>
              <div><label style={labelStyle}>Email Address</label><input type="email" style={inputStyle} value={form.email||''} onChange={e=>set({email:e.target.value})} /></div>
            </div>
            <div style={{ marginTop:16 }}><label style={labelStyle}>Physical Address</label><textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} value={form.address||''} onChange={e=>set({address:e.target.value})} /></div>
          </section>

          <section>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div><label style={labelStyle}>Date Joined</label><input type="date" style={inputStyle} value={form.date_joined||''} onChange={e=>set({date_joined:e.target.value})} /></div>
              <div><label style={labelStyle}>Membership Status</label>
                <select style={selectStyle} value={form.status} onChange={e=>set({status:e.target.value})}>
                  <option>Active</option><option>Inactive</option><option>Deceased</option>
                </select>
              </div>
            </div>
          </section>
        </form>

        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600, fontFamily:'"Inter", system-ui, sans-serif', transition:'all .2s cubic-bezier(.16,1,.3,1)' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(120,150,210,0.08)'; e.currentTarget.style.borderColor = 'rgba(120,150,210,0.25)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border2; }}>Cancel</button>
          <button type="submit" form="member-form" style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg, #1a4fa0, ${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, fontFamily:'"Inter", system-ui, sans-serif', boxShadow:`0 8px 20px rgba(37,99,235,.3)`, transition:'all .2s cubic-bezier(.16,1,.3,1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,.3)'; }}>
            {member?.id ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Members() {
  const { user }              = useAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null);
  const [loading, setLoading] = useState(true);

  const canWrite = ['Super Administrator','Ministry Leader'].includes(user?.role);
  const canDelete = user?.role === 'Super Administrator';

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/members', { params: { search: search || undefined } });
      setMembers(r.data.data);
    } catch { toast.error('Failed to load members.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [search]);

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;
    try { await api.delete(`/members/${id}`); toast.success('Member removed successfully.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error deleting member.'); }
  }

  const statusColor = s => s === 'Active' ? 'green' : s === 'Inactive' ? 'red' : 'gray';

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#2563eb" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#7c3aed" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />
      
      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0, fontFamily:'"Inter", system-ui, sans-serif' }}>
                Registry Management
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em', fontFamily:'"Inter", system-ui, sans-serif' }}>
              Church <span style={{ color: C.gold }}>Members</span>
            </h1>
          </div>
          
          <div className="cmems-header-actions" style={{ display:'flex', gap:12 }}>
            <div className="cmems-search-box" style={{ position:'relative', width:300 }}>
              <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.muted }} size={16} />
              <input
                style={{ ...inputStyle, paddingLeft:42, background:C.panel, borderColor:C.border }}
                placeholder="Search name, email, or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {canWrite && (
              <button onClick={() => setModal({})} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg, #1a4fa0, ${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44, fontFamily:'"Inter", system-ui, sans-serif', transition:'all .2s cubic-bezier(.16,1,.3,1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(37,99,235,.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(37,99,235,.3)'; }}>
                <FiPlus size={18} /> Add Member
              </button>
            )}
          </div>
        </header>

        {/* Stats Summary (Unique addition for professional look) */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20, marginBottom:32 }}>
          {[
            { label:'Total Members', value: members.length, icon:<FiUsers color={C.sky}/> },
            { label:'Active Status', value: members.filter(m=>m.status==='Active').length, icon:<FiCheck color={C.emerald}/> },
            { label:'Recently Joined', value: members.filter(m=> {
                const joined = new Date(m.date_joined);
                const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth()-1);
                return joined > monthAgo;
              }).length, icon:<FiCalendar color={C.gold2}/> }
          ].map((stat, i) => (
            <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:16, transition:'all .2s cubic-bezier(.16,1,.3,1)', cursor:'default' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,30,48,0.8)'; e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width:44, height:44, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, border:`1px solid ${C.border}` }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize:11, color: C.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', fontFamily:'"Inter", system-ui, sans-serif' }}>{stat.label}</div>
                <div style={{ fontSize:20, color: C.text, fontWeight:800, fontFamily:'"Inter", system-ui, sans-serif' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Container */}
        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,.3)', transition:'all .2s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {[
                    { label:'Member Details', width:'30%' },
                    { label:'Contact Info', width:'25%' },
                    { label:'Registration', width:'15%' },
                    { label:'Status', width:'15%' },
                    { label:'', width:'15%' }
                  ].map((h, i) => (
                    <th key={i} style={{ 
                      padding:'16px 24px', textAlign:'left', color: C.sub, fontWeight:800, fontSize:10, 
                      letterSpacing:'.1em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`,
                      width: h.width, fontFamily:'"Inter", system-ui, sans-serif'
                    }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:80 }}>
                    <div style={{ display:'inline-block', width:30, height:30, border:`3px solid ${C.border}`, borderTopColor:C.sky, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    <p style={{ marginTop:16, color: C.muted, fontSize:14, fontFamily:'"Inter", system-ui, sans-serif' }}>Fetching records...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:80, color: C.muted }}>
                    <FiUsers size={40} style={{ opacity:0.2, marginBottom:16 }} />
                    <p style={{ fontSize:15, fontFamily:'"Inter", system-ui, sans-serif' }}>No members found in the database.</p>
                  </td></tr>
                ) : members.map((m, i) => (
                  <tr key={m.id} style={{ transition:'all 0.2s cubic-bezier(.16,1,.3,1)' }} className="member-row" onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <Avatar name={`${m.first_name} ${m.last_name}`} />
                        <div>
                          <div style={{ color: C.text, fontWeight:700, fontSize:15, fontFamily:'"Inter", system-ui, sans-serif' }}>{m.first_name} {m.last_name}</div>
                          <div style={{ color: C.sub, fontSize:12, marginTop:2, fontFamily:'"Inter", system-ui, sans-serif' }}>{m.gender} • {m.middle_name || 'No Middle Name'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, color: C.text, fontSize:13, fontFamily:'"Inter", system-ui, sans-serif' }}>
                          <FiMail size={12} style={{ color: C.sky }} /> {m.email || '—'}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, color: C.sub, fontSize:12, fontFamily:'"Inter", system-ui, sans-serif' }}>
                          <FiPhone size={12} style={{ color: C.muted }} /> {m.contact_number || '—'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color: C.text, fontSize:13, fontWeight:500, fontFamily:'"Inter", system-ui, sans-serif' }}>
                        {m.date_joined ? new Date(m.date_joined).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }) : '—'}
                      </div>
                      <div style={{ color: C.muted, fontSize:11, marginTop:2, fontFamily:'"Inter", system-ui, sans-serif' }}>Date Registered</div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <Badge color={statusColor(m.status)}>{m.status}</Badge>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                        {canWrite && (
                          <button onClick={() => setModal(m)} title="Edit Member" style={{ 
                            width:34, height:34, borderRadius:10, border:`1px solid ${C.border2}`, 
                            background:C.lift, color:C.sky, cursor:'pointer', display:'flex', 
                            alignItems:'center', justifyContent:'center', transition:'all 0.2s cubic-bezier(.16,1,.3,1)', fontFamily:'"Inter", system-ui, sans-serif'
                          }} onMouseEnter={e=>{ e.currentTarget.style.background=C.slate; e.currentTarget.style.transform='scale(1.05)'; }} onMouseLeave={e=>{ e.currentTarget.style.background=C.lift; e.currentTarget.style.transform='scale(1)'; }}>
                            <FiEdit2 size={14} />
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => remove(m.id)} title="Delete Member" style={{ 
                            width:34, height:34, borderRadius:10, border:`1px solid ${C.border2}`, 
                            background:C.lift, color:C.rose, cursor:'pointer', display:'flex', 
                            alignItems:'center', justifyContent:'center', transition:'all 0.2s cubic-bezier(.16,1,.3,1)', fontFamily:'"Inter", system-ui, sans-serif'
                          }} onMouseEnter={e=>{ e.currentTarget.style.background='rgba(225,29,72,0.1)'; e.currentTarget.style.transform='scale(1.05)'; }} onMouseLeave={e=>{ e.currentTarget.style.background=C.lift; e.currentTarget.style.transform='scale(1)'; }}>
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'16px 24px', background: 'rgba(0,0,0,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ color: C.muted, fontSize:12, fontWeight:600, fontFamily:'"Inter", system-ui, sans-serif' }}>
              Showing <span style={{ color: C.sub }}>{members.length}</span> member records
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {[1].map(p => (
                <div key={p} style={{ width:28, height:28, borderRadius:6, background:C.azure, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'"Inter", system-ui, sans-serif', transition:'all .2s cubic-bezier(.16,1,.3,1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .member-row { cursor: pointer; }
        input:focus, select:focus, textarea:focus { border-color: ${C.sky} !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; }
      `}</style>

      {modal !== null && <Modal member={modal.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </div>
  );
}