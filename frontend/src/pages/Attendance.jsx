import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiFilter, FiClipboard } from 'react-icons/fi';
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
    green:  { bg:'rgba(5,150,105,.12)',  color:'#34d399', border:'rgba(5,150,105,.2)' },
    red:    { bg:'rgba(225,29,72,.12)',  color:'#fb7185', border:'rgba(225,29,72,.2)' },
    yellow: { bg:'rgba(217,119,6,.12)',  color:'#fcd34d', border:'rgba(217,119,6,.2)' },
  };
  const s = map[color] || map.yellow;
  return <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' }}>{children}</span>;
}

function statusColor(s) {
  if (s==='Present') return 'green';
  if (s==='Absent')  return 'red';
  return 'yellow';
}

function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '8px', 
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

export default function Attendance() {
  const { user }                      = useAuth();
  const [attendance, setAttendance]   = useState([]);
  const [events, setEvents]           = useState([]);
  const [members, setMembers]         = useState([]);
  const [filterEvent, setFilterEvent] = useState('');
  const [modal, setModal]             = useState(false);
  const [loading, setLoading]         = useState(true);

  const canWrite = ['Super Administrator','Ministry Leader','Choir Coordinator'].includes(user?.role);

  async function load() {
    setLoading(true);
    try {
      const [ar, er, mr] = await Promise.all([
        api.get('/attendance', { params: filterEvent ? { event_id: filterEvent } : {} }),
        api.get('/events'),
        api.get('/members'),
      ]);
      setAttendance(ar.data.data);
      setEvents(er.data.data);
      setMembers(mr.data.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterEvent]);

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#059669" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#2563eb" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Tracking & Reporting
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              Member <span style={{ color: C.emerald }}>Attendance</span>
            </h1>
          </div>
          
          <div style={{ display:'flex', gap:12 }}>
            {canWrite && (
              <button onClick={() => setModal(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
                <FiPlus size={18} /> Record Attendance
              </button>
            )}
          </div>
        </header>

        {/* Filters Section */}
        <div className="cmems-filter-bar" style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, padding:'20px 24px', marginBottom:32, display:'flex', alignItems:'center', gap:20, boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, maxWidth:400 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald }}>
              <FiFilter size={18} />
            </div>
            <div style={{ flex:1 }}>
              <label style={labelStyle}>Filter by Event</label>
              <select style={{ ...inputStyle, background:C.navy, borderColor:C.border }} value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
                <option value="">— View All Events —</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title} ({new Date(e.start_date).toLocaleDateString('en-PH')})</option>)}
              </select>
            </div>
          </div>
          
          <div className="cmems-filter-divider" style={{ height:40, width:1, background:C.border2 }} />
          
          <div style={{ display:'flex', gap:24 }}>
            <div>
              <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Total Records</div>
              <div style={{ fontSize:18, color: C.text, fontWeight:800 }}>{attendance.length}</div>
            </div>
            <div>
              <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Present Today</div>
              <div style={{ fontSize:18, color: C.emerald, fontWeight:800 }}>{attendance.filter(a => a.status === 'Present').length}</div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {[
                    { label:'Member Name', width:'30%' },
                    { label:'Event Activity', width:'25%' },
                    { label:'Date Recorded', width:'15%' },
                    { label:'Status', width:'15%' },
                    { label:'Internal Notes', width:'15%' }
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
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:80 }}>
                    <div style={{ display:'inline-block', width:30, height:30, border:`3px solid ${C.border}`, borderTopColor:C.emerald, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    <p style={{ marginTop:16, color: C.muted, fontSize:14 }}>Retrieving attendance data...</p>
                  </td></tr>
                ) : attendance.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:80, color: C.muted }}>
                    <FiClipboard size={40} style={{ opacity:0.2, marginBottom:16 }} />
                    <p style={{ fontSize:15 }}>No attendance records found in the database.</p>
                  </td></tr>
                ) : attendance.map(a => (
                  <tr key={a.id} style={{ transition:'all 0.2s ease' }} className="attendance-row">
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <Avatar name={a.member_name} />
                        <div style={{ color: C.text, fontWeight:700, fontSize:15 }}>{a.member_name}</div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color: C.text, fontSize:13, fontWeight:600 }}>{a.event_title}</div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, color: C.sub, fontSize:13 }}>
                        <FiCalendar size={12} style={{ color: C.muted }} />
                        {a.attendance_date ? new Date(a.attendance_date).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }) : '—'}
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <Badge color={statusColor(a.status)}>{a.status}</Badge>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color: C.muted, fontSize:12, fontStyle: a.notes ? 'normal' : 'italic' }}>
                        {a.notes || 'No remarks'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'16px 24px', background: 'rgba(0,0,0,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ color: C.muted, fontSize:12, fontWeight:600 }}>
              Total of <span style={{ color: C.sub }}>{attendance.length}</span> individual entries
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {[1].map(p => (
                <div key={p} style={{ width:28, height:28, borderRadius:6, background:C.emerald, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, cursor:'pointer' }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .attendance-row:hover { background: rgba(255,255,255,0.03); }
        input:focus, select:focus, textarea:focus { border-color: ${C.emerald} !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
      `}</style>

      {modal && <RecordModal events={events} members={members} onSave={() => { setModal(false); load(); }} onClose={() => setModal(false)} />}
    </div>
  );
}

function RecordModal({ events, members, onSave, onClose }) {
  const [eventId, setEventId] = useState('');
  const [date, setDate]       = useState(new Date().toISOString().slice(0,10));
  const [rows, setRows]       = useState([]);
  const [saving, setSaving]   = useState(false);

  function initRows() {
    if (!eventId || !members.length) return;
    setRows(members.map(m => ({ event_id: parseInt(eventId), member_id: m.id, member_name: `${m.first_name} ${m.last_name}`, attendance_date: date, status:'Present', notes:'' })));
  }

  useEffect(() => { initRows(); }, [eventId, date]);

  function setRow(i, key, val) {
    setRows(prev => { const n=[...prev]; n[i]={...n[i],[key]:val}; return n; });
  }

  async function save() {
    if (!eventId) { toast.error('Please select an event activity.'); return; }
    if (!rows.length) { toast.error('No member data available for recording.'); return; }
    setSaving(true);
    try {
      await api.post('/attendance', { records: rows });
      toast.success('Attendance records published.'); onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save records.'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:700, maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>Batch Attendance</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Record participation for all ministry members at once</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ padding:'24px 32px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, background: 'rgba(255,255,255,0.02)', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <label style={labelStyle}>Select Event Activity *</label>
            <select style={{ ...inputStyle, background:C.navy }} value={eventId} onChange={e => setEventId(e.target.value)}>
              <option value="">— Select Activity —</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reporting Date *</label>
            <input type="date" style={{ ...inputStyle, background:C.navy }} value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {rows.length > 0 ? (
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: C.lift, position:'sticky', top:0, zIndex:10 }}>
                  {['Member Profile','Participation Status','Remarks'].map(h => (
                    <th key={h} style={{ padding:'12px 24px', textAlign:'left', color: C.sub, fontWeight:800, fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.member_id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'12px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Avatar name={r.member_name} size={28} />
                        <span style={{ color: C.text, fontWeight:700, fontSize:14 }}>{r.member_name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <select style={{ ...inputStyle, padding:'6px 10px', fontSize:13, background:C.navy, width:'140px' }} value={r.status} onChange={e=>setRow(i,'status',e.target.value)}>
                        <option>Present</option><option>Absent</option><option>Excused</option>
                      </select>
                    </td>
                    <td style={{ padding:'12px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <input style={{ ...inputStyle, padding:'6px 10px', fontSize:13, background:C.navy }} value={r.notes} onChange={e=>setRow(i,'notes',e.target.value)} placeholder="Add note..." />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding:60, textAlign:'center', color: C.muted }}>
              <FiUser size={32} style={{ opacity:0.2, marginBottom:12 }} />
              <p>Select an event to load the member roster</p>
            </div>
          )}
        </div>

        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={save} disabled={saving || !eventId} style={{ 
            padding:'10px 28px', borderRadius:10, border:'none', 
            background: (saving||!eventId) ? C.muted : `linear-gradient(135deg,#1a4fa0,${C.azure})`, 
            color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, 
            boxShadow: (saving||!eventId) ? 'none' : `0 8px 20px rgba(37,99,235,.3)`,
            transition:'all 0.2s'
          }}>
            {saving ? 'Publishing...' : 'Submit Records'}
          </button>
        </div>
      </div>
    </div>
  );
}