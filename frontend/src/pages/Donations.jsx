import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiDollarSign, FiTrendingUp, FiFilter, FiUser, FiCalendar, FiPieChart } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', sky:'#3b82f6', gold:'#d97706', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

const TYPES = ['Tithes','Offerings','Building Fund','Missions Fund','Special Offering'];
const COLORS = { Tithes:'#2563eb', Offerings:'#10b981', 'Building Fund':'#f59e0b', 'Missions Fund':'#8b5cf6', 'Special Offering':'#ef4444' };
const EMPTY = { member_id:'', donor_name:'', amount:'', donation_date: new Date().toISOString().slice(0,10), donation_type:'Tithes', remarks:'' };

const inputStyle = { 
  width:'100%', background: C.lift, border:`1px solid ${C.border2}`, borderRadius:10, 
  padding:'10px 14px', color: C.text, fontSize:14, outline:'none', boxSizing:'border-box',
  transition: 'all 0.2s ease'
};
const labelStyle = { fontSize:11, fontWeight:700, color: C.sub, display:'block', marginBottom:6, letterSpacing:'.06em', textTransform:'uppercase' };

const formatPHP = v => `₱${Number(v).toLocaleString('en-PH', { minimumFractionDigits:2 })}`;
const formatShort = v => { const n=Number(v||0); if(n>=1e6) return `₱${(n/1e6).toFixed(1)}M`; if(n>=1e3) return `₱${(n/1e3).toFixed(0)}k`; return `₱${n}`; };

function GlassOrb({ color, size=200, style }) {
  return <div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`, filter:'blur(60px)', pointerEvents:'none', ...style }} aria-hidden="true" />;
}

function Badge({ children, color }) {
  const map = {
    blue:  { bg:'rgba(37,99,235,.12)',  color:'#93c5fd', border:'rgba(37,99,235,.2)' },
    green: { bg:'rgba(5,150,105,.12)',  color:'#34d399', border:'rgba(5,150,105,.2)' },
    violet: { bg:'rgba(124,58,237,.12)', color:'#c4b5fd', border:'rgba(124,58,237,.2)' },
    yellow: { bg:'rgba(245,158,11,.12)', color:'#fbbf24', border:'rgba(245,158,11,.2)' },
    red: { bg:'rgba(239,68,68,.12)', color:'#f87171', border:'rgba(239,68,68,.2)' },
  };
  const typeMap = {
    'Tithes': 'blue',
    'Offerings': 'green',
    'Building Fund': 'yellow',
    'Missions Fund': 'violet',
    'Special Offering': 'red'
  };
  const s = map[typeMap[children] || color] || map.blue;
  return <span style={{ padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:800, letterSpacing:'.04em', whiteSpace:'nowrap', textTransform:'uppercase' }}>{children}</span>;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:12, padding:'14px', fontSize:12, boxShadow:'0 10px 25px rgba(0,0,0,0.4)', backdropFilter:'blur(8px)' }}>
      <div style={{ color: C.text, marginBottom:10, fontWeight:800, borderBottom:`1px solid ${C.border}`, paddingBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, color: C.text, marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block' }}/>
            <span style={{ color: C.sub, fontWeight:600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight:800, color: C.text }}>{formatShort(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

const TYPE_GRADIENTS = {
  'Tithes':          'linear-gradient(135deg,#1a4fa0,#2563eb)',
  'Offerings':       'linear-gradient(135deg,#047857,#10b981)',
  'Building Fund':   'linear-gradient(135deg,#92400e,#f59e0b)',
  'Missions Fund':   'linear-gradient(135deg,#7c3aed,#8b5cf6)',
  'Special Offering':'linear-gradient(135deg,#9d174d,#ef4444)',
};

function Avatar({ name, size = 32 }) {
  const initials = (name||'A').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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

export default function Donations() {
  const [donations, setDonations]   = useState([]);
  const [members, setMembers]       = useState([]);
  const [monthly, setMonthly]       = useState([]);
  const [modal, setModal]           = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading]       = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [dr, mr, mo] = await Promise.all([
        api.get('/donations', { params: typeFilter ? { type: typeFilter } : {} }),
        api.get('/members'),
        api.get('/donations/monthly'),
      ]);
      setDonations(dr.data.data);
      setMembers(mr.data.data);
      const map = {};
      mo.data.data.forEach(r => {
        if (!map[r.month]) map[r.month] = { month: r.month };
        map[r.month][r.donation_type] = parseFloat(r.total);
      });
      setMonthly(Object.values(map).sort((a,b) => a.month.localeCompare(b.month)));
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [typeFilter]);

  const totalAmount = donations.reduce((s,d) => s + parseFloat(d.amount||0), 0);

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'"Inter", system-ui, sans-serif' }}>
      <GlassOrb color="#059669" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#f59e0b" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        {/* Header Section */}
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>
                Financial Stewardship
              </p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>
              Church <span style={{ color: C.emerald }}>Donations</span>
            </h1>
          </div>
          
          <button onClick={() => setModal(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 10px 25px rgba(37,99,235,.3)`, height:44 }}>
            <FiPlus size={18} /> Record Donation
          </button>
        </header>

        {/* Summary Stats Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:20, marginBottom:32 }}>
          {TYPES.map(t => {
            const total = donations.filter(d=>d.donation_type===t).reduce((s,d)=>s+parseFloat(d.amount||0),0);
            return (
              <div key={t} className="stat-card" style={{ 
                background: C.panel, border:`1px solid ${C.border2}`, borderRadius:20, 
                padding:24, position:'relative', overflow:'hidden', transition:'all 0.3s ease',
                boxShadow:'0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: TYPE_GRADIENTS[t] }} />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background: TYPE_GRADIENTS[t], display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.2)' }}>
                    <FiDollarSign size={20} color="#fff" />
                  </div>
                  <div style={{ fontSize:10, color: C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:'.05em' }}>Total Fund</div>
                </div>
                <p style={{ fontSize:11, color: C.sub, fontWeight:700, letterSpacing:'.04em', marginBottom:6, textTransform:'uppercase' }}>{t}</p>
                <p style={{ color: C.text, fontWeight:900, fontSize:22, margin:0 }}>{formatPHP(total)}</p>
              </div>
            );
          })}
        </div>

        {/* Charts & Filters Row */}
        <div className="cmems-chart-row" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, marginBottom:32 }}>
          {/* Main Chart */}
          <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, padding:28, boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.azure }}>
                  <FiTrendingUp size={20} />
                </div>
                <h2 style={{ color: C.text, fontWeight:800, fontSize:18, margin:0 }}>Donation Trends</h2>
              </div>
              <div style={{ fontSize:12, color: C.sub, fontWeight:600 }}>Last 6 Months Activity</div>
            </div>
            
            <div style={{ width:'100%', height:300 }}>
              <ResponsiveContainer>
                <BarChart data={monthly} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: C.sub, fontSize:11, fontWeight:600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.sub, fontSize:11, fontWeight:600 }} tickFormatter={formatShort} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop:20, color: C.sub, fontSize:11, fontWeight:700 }} />
                  {TYPES.map(t => <Bar key={t} dataKey={t} fill={COLORS[t]} radius={[4,4,0,0]} stackId="a" barSize={32} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Filter & Overall Summary */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, padding:28, flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald }}>
                  <FiPieChart size={20} />
                </div>
                <h2 style={{ color: C.text, fontWeight:800, fontSize:18, margin:0 }}>Overview</h2>
              </div>
              <div style={{ marginBottom:24 }}>
                <p style={{ fontSize:11, color: C.sub, fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8 }}>Aggregate Total</p>
                <p style={{ color: C.emerald, fontWeight:900, fontSize:32, margin:0 }}>{formatPHP(totalAmount)}</p>
              </div>
              <div style={{ height:1, background:C.border, marginBottom:24 }} />
              <div>
                <label style={labelStyle}>Quick Filter</label>
                <div style={{ position:'relative' }}>
                  <FiFilter style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.muted }} size={14} />
                  <select style={{ ...inputStyle, paddingLeft:40, background:C.navy }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Donation Types</option>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {[
                    { label:'Donor Identity', width:'25%' },
                    { label:'Fund Category', width:'20%' },
                    { label:'Amount (PHP)', width:'15%' },
                    { label:'Date Received', width:'15%' },
                    { label:'Internal Remarks', width:'25%' }
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
                  </td></tr>
                ) : donations.map(d => (
                  <tr key={d.id} style={{ transition:'all 0.2s ease' }} className="donation-row">
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <Avatar name={d.member_name||d.donor_name||'Anonymous'} />
                        <div style={{ color: C.text, fontWeight:700, fontSize:14 }}>{d.member_name||d.donor_name||'Anonymous Donor'}</div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <Badge>{d.donation_type}</Badge>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color:'#34d399', fontWeight:900, fontSize:15 }}>{formatPHP(d.amount)}</div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, color: C.sub, fontSize:13 }}>
                        <FiCalendar size={12} style={{ color: C.muted }} />
                        {d.donation_date ? new Date(d.donation_date).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }) : '—'}
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color: C.muted, fontSize:12, fontStyle: d.remarks ? 'normal' : 'italic' }}>
                        {d.remarks || 'No remarks provided'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'16px 24px', background: 'rgba(0,0,0,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ color: C.muted, fontSize:12, fontWeight:600 }}>
              Audit trail of <span style={{ color: C.sub }}>{donations.length}</span> individual donations
            </div>
            <div style={{ color: C.text, fontSize:13, fontWeight:800 }}>
              Page 1 of 1
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .stat-card:hover { border-color: rgba(255,255,255,0.2) !important; transform: translateY(-4px); }
        .donation-row:hover { background: rgba(255,255,255,0.03); }
        input:focus, select:focus, textarea:focus { border-color: ${C.emerald} !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
      `}</style>

      {modal && (
        <DonationModal members={members} onSave={async form => {
          try { await api.post('/donations', form); toast.success('Financial record published successfully.'); load(); setModal(false); }
          catch(e) { toast.error(e.response?.data?.message||'Failed to save donation record.'); }
        }} onClose={() => setModal(false)} />
      )}
    </div>
  );
}

function DonationModal({ members, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const set = f => setForm(p => ({ ...p, ...f }));
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(4,7,13,.8)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, width:'100%', maxWidth:500, boxShadow:'0 32px 80px rgba(0,0,0,.8)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px', borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 style={{ color: C.text, fontSize:20, fontWeight:800, margin:0 }}>Record Offering</h3>
            <p style={{ color: C.sub, fontSize:12, margin:'4px 0 0 0' }}>Log financial contributions to ministry funds</p>
          </div>
          <button onClick={onClose} style={{ background:C.lift, border:`1px solid ${C.border2}`, borderRadius:'50%', cursor:'pointer', color: C.sub, padding:8, display:'flex' }}><FiX size={18} /></button>
        </div>
        
        <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <label style={labelStyle}>Donor Identification</label>
            <div style={{ position:'relative' }}>
              <FiUser style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.muted }} size={14} />
              <select style={{ ...inputStyle, paddingLeft:40, background:C.navy }} value={form.member_id} onChange={e=>set({member_id:e.target.value})}>
                <option value="">— Anonymous / Walk-in —</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
              </select>
            </div>
          </div>
          
          {!form.member_id && (
            <div>
              <label style={labelStyle}>Manual Donor Name</label>
              <input style={inputStyle} placeholder="Enter name for walk-in donors" value={form.donor_name} onChange={e=>set({donor_name:e.target.value})} />
            </div>
          )}
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={labelStyle}>Amount (₱) *</label>
              <div style={{ position:'relative' }}>
                <FiDollarSign style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.emerald }} size={14} />
                <input type="number" step="0.01" min="1" style={{ ...inputStyle, paddingLeft:40 }} required placeholder="0.00" value={form.amount} onChange={e=>set({amount:e.target.value})} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Donation Date</label>
              <input type="date" style={inputStyle} value={form.donation_date} onChange={e=>set({donation_date:e.target.value})} />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Fund Category *</label>
            <select style={{ ...inputStyle, background:C.navy }} value={form.donation_type} onChange={e=>set({donation_type:e.target.value})}>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          
          <div>
            <label style={labelStyle}>Internal Remarks</label>
            <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} placeholder="Optional notes about this contribution..." value={form.remarks} onChange={e=>set({remarks:e.target.value})} />
          </div>
        </div>
        
        <div style={{ padding:'20px 32px', background: C.navy, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, border:`1px solid ${C.border2}`, background:'transparent', color: C.sub, fontSize:14, cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#1a4fa0,${C.azure})`, color:'#fff', fontSize:14, cursor:'pointer', fontWeight:700, boxShadow:`0 8px 20px rgba(37,99,235,.3)` }}>Confirm Record</button>
        </div>
      </div>
    </div>
  );
}