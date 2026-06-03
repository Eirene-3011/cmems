import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiHeart, FiCalendar, FiUser, FiActivity, FiTag, FiClock, FiShield } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const inputStyle = { 
  width:'100%', background: C.lift, border:`1px solid ${C.border2}`, borderRadius:10, 
  padding:'10px 14px', color: C.text, fontSize:14, outline:'none', boxSizing:'border-box',
  transition: 'all 0.2s ease'
};
const labelStyle = { fontSize:11, fontWeight:700, color: C.sub, display:'block', marginBottom:6, letterSpacing:'.06em', textTransform:'uppercase' };

function GlassOrb({ color, size=200, style }) {
  return <div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`, filter:'blur(60px)', pointerEvents:'none', ...style }} aria-hidden="true" />;
}

function Badge({ children, color }) {
  const map = {
    green:  { bg:'rgba(5,150,105,.12)',  color:'#34d399',  border:'rgba(5,150,105,.2)' },
    blue:   { bg:'rgba(37,99,235,.12)',  color:'#93c5fd',  border:'rgba(37,99,235,.2)' },
    red:    { bg:'rgba(225,29,72,.12)',  color:'#fb7185',  border:'rgba(225,29,72,.2)' },
    yellow: { bg:'rgba(217,119,6,.12)', color:'#fcd34d',  border:'rgba(217,119,6,.2)' },
  };
  const s = map[color]||map.yellow;
  return <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' }}>{children}</span>;
}

function statusColor(s) {
  if (s==='Confirmed') return 'green';
  if (s==='Completed') return 'blue';
  if (s==='No Show')   return 'red';
  return 'yellow';
}

function Avatar({ name, size = 44 }) {
  const initials = (name||'V')[0].toUpperCase();
  const hue = ((name||'').charCodeAt(0)*37)%360;
  return (
    <div style={{ 
      width:size, height:size, borderRadius:'12px', 
      background:`linear-gradient(135deg, hsl(${hue},60%,25%), hsl(${hue+40},70%,40%))`, 
      display:'flex', alignItems:'center', justifyContent:'center', 
      fontSize:size*0.38, fontWeight:800, color:'#fff', flexShrink:0, 
      boxShadow:`0 4px 12px hsla(${hue},60%,20%,.4)`,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {initials}
    </div>
  );
}

export default function Volunteers() {
  const { user }                      = useAuth();
  const [volunteers, setVolunteers]   = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers]         = useState([]);
  const [events, setEvents]           = useState([]);
  const [tab, setTab]                 = useState('volunteers');
  const [volModal, setVolModal]       = useState(false);
  const [assModal, setAssModal]       = useState(false);

  const canWrite = ['Super Administrator','Ministry Leader'].includes(user?.role);

  async function load() {
    try {
      const [vr, ar, mr, er] = await Promise.all([
        api.get('/volunteers'),
        api.get('/volunteers/assignments'),
        api.get('/members'),
        api.get('/events'),
      ]);
      setVolunteers(vr.data.data);
      setAssignments(ar.data.data);
      setMembers(mr.data.data);
      setEvents(er.data.data);
    } catch(e) { toast.error('Failed to synchronize records.'); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#e11d48" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#2563eb" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Service & Engagement
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              Ministry <span style={{ color: C.rose }}>Volunteers</span>
            </h1>
          </div>
          
          {canWrite && (
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setVolModal(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:`1px solid ${C.border2}`, background:C.lift, color: C.text, fontWeight:700, fontSize:14, cursor:'pointer', height:44, transition:'all 0.2s' }} className="btn-secondary">
                <FiPlus size={18} /> Register Volunteer
              </button>
              <button onClick={() => setAssModal(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
                <FiPlus size={18} /> New Assignment
              </button>
            </div>
          )}
        </header>

        {/* Custom Tabs */}
        <div className="cmems-vol-tabs" style={{ display:'flex', gap:8, marginBottom:32, background: C.panel, padding:6, borderRadius:16, width:'fit-content', border:`1px solid ${C.border2}` }}>
          {['volunteers','assignments'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ 
              padding:'10px 24px', borderRadius:12, border:'none', 
              background: tab===t ? C.lift : 'transparent', 
              color: tab===t ? C.sky : C.sub, 
              fontSize:14, fontWeight:800, cursor:'pointer', transition:'all .2s',
              textTransform:'capitalize', display:'flex', alignItems:'center', gap:8
            }}>
              {t === 'volunteers' ? <FiUser size={16}/> : <FiActivity size={16}/>}
              {t}
            </button>
          ))}
        </div>

        {tab === 'volunteers' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
            {volunteers.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'100px 0', background:C.panel, borderRadius:24, border:`1px dashed ${C.border2}` }}>
                <FiHeart size={48} color={C.muted} style={{ marginBottom:16, opacity:0.3 }} />
                <p style={{ color: C.muted, fontSize:16 }}>No registered volunteers yet.</p>
              </div>
            )}
            {volunteers.map(v => (
              <div key={v.id} className="volunteer-card" style={{ 
                background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, 
                padding:28, position:'relative', overflow:'hidden', transition:'all 0.3s ease', 
                cursor:'default', display:'flex', flexDirection:'column', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'
              }}>
                <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle, rgba(225,29,72,0.08), transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }} />
                
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                  <Avatar name={v.member_name} />
                  <div style={{ flex:1, overflow:'hidden' }}>
                    <p style={{ color: C.text, fontWeight:800, fontSize:16, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v.member_name}</p>
                    <p style={{ color: C.muted, fontSize:12, marginTop:2, overflow:'hidden', textOverflow:'ellipsis' }}>{v.email||'No email contact'}</p>
                  </div>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(225,29,72,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:C.rose }}>
                    <FiHeart size={16} />
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
                  <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:16, padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <FiTag size={12} style={{ color: C.gold2 }} />
                      <span style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Expertise & Skills</span>
                    </div>
                    <p style={{ color: C.text, fontSize:13, margin:0, fontWeight:600, lineHeight:1.4 }}>{v.skills||'General Assistance'}</p>
                  </div>
                  
                  <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:16, padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <FiClock size={12} style={{ color: C.sky }} />
                      <span style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Availability</span>
                    </div>
                    <p style={{ color: C.text, fontSize:13, margin:0, fontWeight:600 }}>{v.availability||'Flexible Schedule'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'assignments' && (
          <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {[
                      { label:'Volunteer', width:'25%' },
                      { label:'Event / Activity', width:'25%' },
                      { label:'Assigned Role', width:'20%' },
                      { label:'Reporting Schedule', width:'15%' },
                      { label:'Status', width:'15%' }
                    ].map((h, i) => (
                      <th key={i} style={{ 
                        padding:'18px 24px', textAlign:'left', color: C.sub, fontWeight:800, fontSize:10, 
                        letterSpacing:'.1em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`,
                        width: h.width
                      }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign:'center', padding:80, color: C.muted }}>
                      <FiActivity size={40} style={{ opacity:0.2, marginBottom:16 }} />
                      <p style={{ fontSize:15 }}>No active assignments found.</p>
                    </td></tr>
                  ) : assignments.map(a => (
                    <tr key={a.id} style={{ transition:'all 0.2s ease' }} className="assignment-row">
                      <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <Avatar name={a.volunteer_name} size={32} />
                          <div style={{ color: C.text, fontWeight:700, fontSize:14 }}>{a.volunteer_name}</div>
                        </div>
                      </td>
                      <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ color: C.text, fontSize:13, fontWeight:600 }}>{a.event_title}</div>
                      </td>
                      <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, color: C.sub, fontSize:13 }}>
                          <FiShield size={12} style={{ color: C.gold2 }} />
                          {a.role}
                        </div>
                      </td>
                      <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ color: C.sub, fontSize:13, whiteSpace:'nowrap' }}>
                          {a.schedule ? new Date(a.schedule).toLocaleString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}
                        </div>
                      </td>
                      <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                        <Badge color={statusColor(a.status)}>{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:'16px 24px', background: 'rgba(0,0,0,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ color: C.muted, fontSize:12, fontWeight:600 }}>
                Showing <span style={{ color: C.sub }}>{assignments.length}</span> active service assignments
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .volunteer-card:hover { 
          border-color: rgba(225,29,72,0.4) !important; 
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
        }
        .assignment-row:hover { background: rgba(255,255,255,0.03); }
        .btn-secondary:hover { background: ${C.slate} !important; border-color: ${C.sub} !important; }
        input:focus, select:focus, textarea:focus { border-color: ${C.sky} !important; box-shadow: 0 0 0 3px rgba(37,130,246,0.1); }
      `}</style>

      {volModal && (
        <VolunteerModal members={members} onSave={async form => {
          try { await api.post('/volunteers', form); toast.success('Volunteer profile registered.'); load(); setVolModal(false); }
          catch(e) { toast.error(e.response?.data?.message||'Failed to register volunteer.'); }
        }} onClose={() => setVolModal(false)} />
      )}
      {assModal && (
        <AssignModal volunteers={volunteers} events={events} onSave={async form => {
          try { await api.post('/volunteers/assignments', form); toast.success('Service assignment published.'); load(); setAssModal(false); }
          catch(e) { toast.error(e.response?.data?.message||'Failed to create assignment.'); }
        }} onClose={() => setAssModal(false)} />
      )}
    </div>
  );
}

function VolunteerModal({ members, onSave, onClose }) {
  const [form, setForm] = useState({ member_id:'', skills:'', availability:'' });
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:460, boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>Volunteer Registry</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Register a church member for voluntary service</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <label style={labelStyle}>Select Member *</label>
            <select style={{ ...inputStyle, background:C.navy }} value={form.member_id} onChange={e=>setForm(p=>({...p,member_id:e.target.value}))}>
              <option value="">— Choose a Member —</option>
              {members.map(m=><option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Special Skills & Expertise</label>
            <input style={inputStyle} placeholder="e.g. Graphic Design, Event Planning, First Aid" value={form.skills} onChange={e=>setForm(p=>({...p,skills:e.target.value}))} />
          </div>
          <div>
            <label style={labelStyle}>General Availability</label>
            <input style={inputStyle} placeholder="e.g. Weekends only, Monday nights" value={form.availability} onChange={e=>setForm(p=>({...p,availability:e.target.value}))} />
          </div>
        </div>
        
        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>Register Volunteer</button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({ volunteers, events, onSave, onClose }) {
  const [form, setForm] = useState({ volunteer_id:'', event_id:'', role:'', schedule:'', notes:'' });
  const ROLES = ['Usher','Multimedia Team','Choir Assistant','Event Organizer','Security','Greeter','Food Service','Prayer Team'];
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:480, boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>New Assignment</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Assign a volunteer to a specific role and event</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={labelStyle}>Volunteer *</label>
              <select style={{ ...inputStyle, background:C.navy }} value={form.volunteer_id} onChange={e=>setForm(p=>({...p,volunteer_id:e.target.value}))}>
                <option value="">— Select —</option>
                {volunteers.map(v=><option key={v.id} value={v.id}>{v.member_name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Target Event *</label>
              <select style={{ ...inputStyle, background:C.navy }} value={form.event_id} onChange={e=>setForm(p=>({...p,event_id:e.target.value}))}>
                <option value="">— Select —</option>
                {events.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={labelStyle}>Service Role *</label>
              <select style={{ ...inputStyle, background:C.navy }} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                <option value="">— Select Role —</option>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Reporting Time</label>
              <input type="datetime-local" style={{ ...inputStyle, background:C.navy }} value={form.schedule} onChange={e=>setForm(p=>({...p,schedule:e.target.value}))} />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Assignment Notes</label>
            <textarea style={{ ...inputStyle, background:C.navy, resize:'vertical', minHeight:80 }} placeholder="Any specific instructions for this assignment..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} />
          </div>
        </div>
        
        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>Confirm Assignment</button>
        </div>
      </div>
    </div>
  );
}