import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiMusic, FiEdit2, FiTrash2, FiUser, FiActivity, FiMic } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const EMPTY = { name:'', description:'', coordinator_id:'', status:'Active' };

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
    green:  { bg:'rgba(5,150,105,.12)',   color:'#34d399', border:'rgba(5,150,105,.2)' },
    red:    { bg:'rgba(225,29,72,.12)',   color:'#fb7185', border:'rgba(225,29,72,.2)' },
    violet: { bg:'rgba(124,58,237,.12)',  color:'#c4b5fd', border:'rgba(124,58,237,.2)' },
  };
  const s = map[color] || map.violet;
  return <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' }}>{children}</span>;
}

const CHOIR_GRADIENTS = [
  'linear-gradient(135deg,#7c3aed,#a855f7)',
  'linear-gradient(135deg,#2563eb,#3b82f6)',
  'linear-gradient(135deg,#0e7490,#0891b2)',
  'linear-gradient(135deg,#9d174d,#e11d48)',
  'linear-gradient(135deg,#047857,#059669)',
  'linear-gradient(135deg,#92400e,#d97706)',
];

export default function Choirs() {
  const { user }              = useAuth();
  const [choirs, setChoirs]   = useState([]);
  const [members, setMembers] = useState([]);
  const [modal, setModal]     = useState(null);
  const [loading, setLoading] = useState(true);

  const canWrite = ['Super Administrator','Choir Coordinator'].includes(user?.role);

  async function load() {
    setLoading(true);
    try {
      const [cr, mr] = await Promise.all([api.get('/choirs'), api.get('/members')]);
      setChoirs(cr.data.data);
      setMembers(mr.data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(form) {
    try {
      if (form.id) await api.put(`/choirs/${form.id}`, form);
      else         await api.post('/choirs', form);
      toast.success('Choir group saved.'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving choir.'); }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to disband this choir?')) return;
    try { await api.delete(`/choirs/${id}`); toast.success('Choir removed.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error removing choir.'); }
  }

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#7c3aed" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#2563eb" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Music & Liturgy
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              Choir <span style={{ color: C.violet }}>Groups</span>
            </h1>
          </div>
          {canWrite && (
            <button onClick={() => setModal(EMPTY)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
              <FiPlus size={18} /> Add Choir
            </button>
          )}
        </header>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 0' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${C.border2}`, borderTopColor: C.violet, animation:'spin 0.8s linear infinite' }} />
            <p style={{ marginTop:20, color: C.sub, fontWeight:500 }}>Harmonizing records...</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:24 }}>
            {choirs.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'100px 0', background:C.panel, borderRadius:24, border:`1px dashed ${C.border2}` }}>
                <FiMusic size={48} color={C.muted} style={{ marginBottom:16, opacity:0.3 }} />
                <p style={{ color: C.muted, fontSize:16 }}>No choir groups registered.</p>
              </div>
            )}
            {choirs.map((c, i) => (
              <div key={c.id} className="choir-card" style={{ 
                background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, 
                padding:28, position:'relative', overflow:'hidden', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                cursor:'default', display:'flex', flexDirection:'column', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'
              }}>
                {/* Background Accent */}
                <div style={{ position:'absolute', top:-40, left:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${CHOIR_GRADIENTS[i%6].split(',')[1].replace(')','').trim()}12, transparent 70%)`, filter:'blur(30px)', pointerEvents:'none' }} />
                
                <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:20 }}>
                  <div style={{ 
                    width:56, height:56, borderRadius:16, background: CHOIR_GRADIENTS[i%6], 
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)', flexShrink:0
                  }}>
                    <FiMusic size={26} color="#fff" />
                  </div>
                  <div style={{ flex:1, overflow:'hidden' }}>
                    <h3 style={{ color: C.text, fontWeight:800, fontSize:18, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</h3>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                      <FiUser size={12} color={C.muted} />
                      <span style={{ color: C.muted, fontSize:12, fontWeight:600 }}>{c.coordinator_name||'No Coordinator'}</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: C.sub, fontSize:14, marginBottom:24, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>
                  {c.description||'An ensemble of voices dedicated to elevating spiritual worship through sacred choral music and liturgical participation.'}
                </p>

                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', borderRadius:16, padding:'14px 18px',
                  display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20
                }}>
                  <Badge color={c.status==='Active'?'green':'red'}>{c.status}</Badge>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Roster</div>
                    <div style={{ fontSize:13, color: C.violet, fontWeight:800 }}>{c.member_count} <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Voices</span></div>
                  </div>
                </div>

                {canWrite && (
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={() => setModal(c)} style={{ 
                      flex:1, padding:'10px 0', borderRadius:12, border:`1px solid ${C.border2}`, 
                      background:C.lift, color: C.text, fontSize:13, cursor:'pointer', fontWeight:700, 
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s'
                    }} className="btn-secondary">
                      <FiEdit2 size={14} /> Edit Group
                    </button>
                    <button onClick={() => remove(c.id)} style={{ 
                      width:44, height:42, borderRadius:12, border:`1px solid rgba(225,29,72,.2)`, 
                      background:'rgba(225,29,72,.05)', color:'#fb7185', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s'
                    }} className="btn-danger">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:480, boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>{modal.id ? 'Edit Choir' : 'New Choir'}</h3>
                <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Manage vocal ensemble details and leadership</p>
              </div>
              <button onClick={() => setModal(null)} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
            </div>
            <ChoirForm init={modal} members={members} onSave={save} onCancel={() => setModal(null)} />
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .choir-card:hover { 
          border-color: rgba(124,58,237,0.4) !important; 
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
        }
        .btn-secondary:hover { background: ${C.slate} !important; border-color: ${C.violet} !important; }
        .btn-danger:hover { background: rgba(225,29,72,0.15) !important; border-color: rgba(225,29,72,0.4) !important; }
        input:focus, select:focus, textarea:focus { border-color: ${C.violet} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
      `}</style>
    </div>
  );
}

function ChoirForm({ init, members, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...init });
  const set = f => setForm(p => ({ ...p, ...f }));
  return (
    <>
      <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20 }}>
        <div>
          <label style={labelStyle}>Choir Name *</label>
          <input style={inputStyle} placeholder="e.g. Celestial Harmony" value={form.name} onChange={e=>set({name:e.target.value})} />
        </div>
        
        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, resize:'vertical', minHeight:100 }} placeholder="Vision and purpose of this vocal group..." value={form.description||''} onChange={e=>set({description:e.target.value})} />
        </div>
        
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={labelStyle}>Coordinator</label>
            <select style={{ ...inputStyle, cursor:'pointer' }} value={form.coordinator_id||''} onChange={e=>set({coordinator_id:e.target.value||null})}>
              <option value="">— Select —</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, cursor:'pointer' }} value={form.status} onChange={e=>set({status:e.target.value})}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
        <button onClick={onCancel} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
        <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>
          {form.id ? 'Save Changes' : 'Create Choir'}
        </button>
      </div>
    </>
  );
}