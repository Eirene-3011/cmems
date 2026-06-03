import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowRight, FiActivity } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const TYPES = ['Sunday Worship','Bible Study','Youth Camp','Retreat','Choir Practice','Special Event','Outreach','Conference'];
const STATUSES = ['Upcoming','Ongoing','Completed','Cancelled'];
const EMPTY = { title:'', description:'', event_type:'Sunday Worship', venue:'', start_date:'', end_date:'', capacity:'', status:'Upcoming' };

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
    blue:   { bg:'rgba(37,99,235,.12)',   color:'#93c5fd', border:'rgba(37,99,235,.2)' },
    yellow: { bg:'rgba(217,119,6,.12)',   color:'#fcd34d', border:'rgba(217,119,6,.2)' },
    green:  { bg:'rgba(5,150,105,.12)',   color:'#34d399', border:'rgba(5,150,105,.2)' },
    gray:   { bg:'rgba(120,150,210,.08)',  color: C.sub,    border: C.border },
    violet: { bg:'rgba(124,58,237,.12)',  color:'#c4b5fd', border:'rgba(124,58,237,.2)' },
  };
  const s = map[color] || map.gray;
  return <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' }}>{children}</span>;
}

function statusBadgeColor(s) {
  if (s==='Upcoming')  return 'blue';
  if (s==='Ongoing')   return 'yellow';
  if (s==='Completed') return 'green';
  return 'gray';
}

const TYPE_GRADIENTS = {
  'Sunday Worship':  'linear-gradient(135deg,#1a4fa0,#2563eb)',
  'Bible Study':     'linear-gradient(135deg,#047857,#059669)',
  'Youth Camp':      'linear-gradient(135deg,#9d174d,#e11d48)',
  'Retreat':         'linear-gradient(135deg,#7c3aed,#a855f7)',
  'Choir Practice':  'linear-gradient(135deg,#0e7490,#0891b2)',
  'Special Event':   'linear-gradient(135deg,#92400e,#d97706)',
  'Outreach':        'linear-gradient(135deg,#065f46,#10b981)',
  'Conference':      'linear-gradient(135deg,#1e3a8a,#3b82f6)',
};

export default function Events() {
  const { user }            = useAuth();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [modal, setModal]   = useState(null);
  const [loading, setLoading] = useState(true);

  const canWrite = ['Super Administrator','Ministry Leader'].includes(user?.role);
  const isAdmin  = user?.role === 'Super Administrator';

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/events', { params: filter ? { status: filter } : {} });
      setEvents(r.data.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filter]);

  async function save(form) {
    try {
      if (form.id) await api.put(`/events/${form.id}`, form);
      else         await api.post('/events', form);
      toast.success('Event details updated.'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving event.'); }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try { await api.delete(`/events/${id}`); toast.success('Event deleted.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error deleting event.'); }
  }

  const FILTERS = ['','Upcoming','Ongoing','Completed','Cancelled'];

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#d97706" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#2563eb" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Schedule & Calendar
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              Ministry <span style={{ color: C.rose }}>Events</span>
            </h1>
          </div>
          
          <div style={{ display:'flex', gap:12 }}>
            {canWrite && (
              <button onClick={() => setModal(EMPTY)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
                <FiPlus size={18} /> Create Event
              </button>
            )}
          </div>
        </header>

        {/* Filters Section */}
        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, padding:'8px', marginBottom:32, display:'inline-flex', flexWrap:'wrap', gap:4, boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
          {FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ 
              padding:'10px 20px', borderRadius:14, border:'none', 
              background: filter===s ? C.lift : 'transparent', 
              color: filter===s ? C.sky : C.sub, 
              fontSize:13, cursor:'pointer', fontWeight:700, transition:'all .2s',
              display:'flex', alignItems:'center', gap:8
            }}>
              {filter===s && <div style={{ width:6, height:6, borderRadius:'50%', background:C.sky }} />}
              {s||'All Events'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 0' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${C.border2}`, borderTopColor: C.azure, animation:'spin 0.8s linear infinite' }} />
            <p style={{ marginTop:20, color: C.sub, fontWeight:500 }}>Syncing calendar...</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
            {events.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'100px 0', background:C.panel, borderRadius:24, border:`1px dashed ${C.border2}` }}>
                <FiCalendar size={48} color={C.muted} style={{ marginBottom:16, opacity:0.3 }} />
                <p style={{ color: C.muted, fontSize:16 }}>No events found for this category.</p>
              </div>
            )}
            {events.map(ev => (
              <div key={ev.id} className="event-card" style={{ 
                background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, 
                padding:28, position:'relative', overflow:'hidden', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                cursor:'default', display:'flex', flexDirection:'column', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'
              }}>
                {/* Visual Type Indicator */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: TYPE_GRADIENTS[ev.event_type] || TYPE_GRADIENTS['Sunday Worship'] }} />
                
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <Badge color="violet">{ev.event_type}</Badge>
                  <Badge color={statusBadgeColor(ev.status)}>{ev.status}</Badge>
                </div>

                <div style={{ flex:1 }}>
                  <h3 style={{ color: C.text, fontWeight:800, fontSize:19, marginBottom:10, letterSpacing:'-0.01em', lineHeight:1.3 }}>{ev.title}</h3>
                  <p style={{ color: C.sub, fontSize:14, marginBottom:24, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {ev.description||'Join us for this meaningful ministry gathering as we grow together in faith and community.'}
                  </p>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, color: C.text, fontSize:13, fontWeight:600 }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.azure }}>
                      <FiCalendar size={14} />
                    </div>
                    {new Date(ev.start_date).toLocaleString('en-PH',{month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                  </div>
                  {ev.venue && (
                    <div style={{ display:'flex', alignItems:'center', gap:12, color: C.sub, fontSize:13 }}>
                      <div style={{ width:32, height:32, borderRadius:10, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.rose }}>
                        <FiMapPin size={14} />
                      </div>
                      {ev.venue}
                    </div>
                  )}
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', borderRadius:16, padding:'16px',
                  display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20
                }}>
                  <div>
                    <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Attendance</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                      <FiUsers size={14} color={C.emerald} />
                      <span style={{ fontSize:14, color: C.text, fontWeight:800 }}>{ev.total_attendees}</span>
                      <span style={{ fontSize:11, color: C.sub, fontWeight:600 }}>({ev.attendance_percentage}%)</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Capacity</div>
                    <div style={{ fontSize:14, color: C.sky, fontWeight:800, marginTop:2 }}>{ev.capacity??'∞'}</div>
                  </div>
                </div>

                {(canWrite||isAdmin) && (
                  <div style={{ display:'flex', gap:10 }}>
                    {canWrite && (
                      <button onClick={() => setModal(ev)} style={{ 
                        flex:1, padding:'10px 0', borderRadius:12, border:`1px solid ${C.border2}`, 
                        background:C.lift, color: C.text, fontSize:13, cursor:'pointer', fontWeight:700, 
                        display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s'
                      }} className="btn-secondary">
                        <FiEdit2 size={14} /> Edit Event
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => remove(ev.id)} style={{ 
                        width:44, height:42, borderRadius:12, border:`1px solid rgba(225,29,72,.2)`, 
                        background:'rgba(225,29,72,.05)', color:'#fb7185', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s'
                      }} className="btn-danger">
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && <EventModal form={modal} onSave={save} onClose={() => setModal(null)} />}
      
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .event-card:hover { 
          border-color: rgba(37,99,235,0.4) !important; 
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
        }
        .btn-secondary:hover { background: ${C.slate} !important; border-color: ${C.sky} !important; }
        .btn-danger:hover { background: rgba(225,29,72,0.15) !important; border-color: rgba(225,29,72,0.4) !important; }
        input:focus, select:focus, textarea:focus { border-color: ${C.sky} !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      `}</style>
    </div>
  );
}

function EventModal({ form: init, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...init });
  const set = f => setForm(p => ({ ...p, ...f }));
  const fmt = dt => dt ? new Date(dt).toISOString().slice(0,16) : '';

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:600, maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>{form.id ? 'Edit Event' : 'Create New Event'}</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Organize and schedule ministry activities</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ overflowY:'auto', padding:32, display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <label style={labelStyle}>Event Title *</label>
            <input style={inputStyle} required placeholder="e.g. Annual Youth Retreat 2026" value={form.title} onChange={e=>set({title:e.target.value})} />
          </div>
          
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} placeholder="Provide details about the event's purpose and agenda..." value={form.description||''} onChange={e=>set({description:e.target.value})} />
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={labelStyle}>Event Type *</label>
              <select style={{ ...inputStyle, cursor:'pointer' }} value={form.event_type} onChange={e=>set({event_type:e.target.value})}>
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor:'pointer' }} value={form.status} onChange={e=>set({status:e.target.value})}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Venue / Location</label>
            <div style={{ position:'relative' }}>
              <FiMapPin style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.muted }} size={14} />
              <input style={{ ...inputStyle, paddingLeft:40 }} placeholder="Main Sanctuary, Community Hall, etc." value={form.venue||''} onChange={e=>set({venue:e.target.value})} />
            </div>
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={labelStyle}>Start Date & Time *</label>
              <input type="datetime-local" style={inputStyle} required value={fmt(form.start_date)} onChange={e=>set({start_date:e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>End Date & Time *</label>
              <input type="datetime-local" style={inputStyle} required value={fmt(form.end_date)} onChange={e=>set({end_date:e.target.value})} />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Attendee Capacity</label>
            <input type="number" min="1" style={inputStyle} value={form.capacity||''} onChange={e=>set({capacity:e.target.value})} placeholder="Leave blank for unlimited" />
          </div>
        </div>
        
        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>
            {form.id ? 'Save Changes' : 'Publish Event'}
          </button>
        </div>
      </div>
    </div>
  );
}