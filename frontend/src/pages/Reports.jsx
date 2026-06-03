import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiBarChart2, FiUsers, FiActivity, FiLayers, FiCalendar, FiTarget, FiClock } from 'react-icons/fi';

const C = {
  obsidian:'#080c14', navy:'#0b1220', slate:'#111b2e', panel:'#141e30', lift:'#1a2640',
  border:'rgba(120,150,210,0.1)', border2:'rgba(120,150,210,0.18)',
  azure:'#2563eb', sky:'#3b82f6', gold2:'#f59e0b',
  rose:'#e11d48', emerald:'#059669', violet:'#7c3aed',
  text:'#e8edf8', sub:'#7c93b8', muted:'#3d5278',
};

function GlassOrb({ color, size=200, style }) {
  return <div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${color}22, ${color}08 55%, transparent 75%)`, filter:'blur(60px)', pointerEvents:'none', ...style }} aria-hidden="true" />;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:12, padding:'14px', fontSize:12, boxShadow:'0 10px 25px rgba(0,0,0,0.4)' }}>
      <div style={{ color: C.text, marginBottom:10, fontWeight:800, borderBottom:`1px solid ${C.border}`, paddingBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, color: C.text, marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block' }}/>
            <span style={{ color: C.sub, fontWeight:600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight:800, color: C.text }}>{typeof p.value === 'number' && p.name.includes('%') ? `${p.value}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Avatar({ name, size = 32 }) {
  const safeName = name || 'M';
  const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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

export default function Reports() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/dashboard/reports/ministry-participation')
      .then(r => {
        if (isMounted) setData(r.data.data || []);
      })
      .catch(err => {
        console.error('Reports Fetch Error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const byMinistry = (data || []).reduce((acc, row) => {
    const mName = row.ministry_name || 'Unassigned';
    if (!acc[mName]) acc[mName] = { name: mName, total_members:0, rates:[] };
    acc[mName].total_members++;
    acc[mName].rates.push(parseFloat(row.attendance_rate||0));
    return acc;
  }, {});

  const chartData = Object.values(byMinistry).map(m => ({
    name: m.name,
    members: m.total_members,
    avg_attendance: m.rates.length ? Math.round(m.rates.reduce((s,r)=>s+r,0)/m.rates.length) : 0,
  }));

  const totalMembers   = chartData.reduce((s,d)=>s+d.members, 0);
  const avgAttendance  = chartData.length ? Math.round(chartData.reduce((s,d)=>s+d.avg_attendance,0)/chartData.length) : 0;
  const topMinistry    = [...chartData].sort((a,b)=>b.avg_attendance-a.avg_attendance)[0]?.name || '—';

  return (
    <div className="cmems-page" style={{ minHeight:'100vh', background: C.obsidian, margin:'-24px', padding:'40px 40px 80px 40px', position:'relative', overflow:'hidden', fontFamily:'system-ui, -apple-system, sans-serif' }}>
      <GlassOrb color="#2563eb" size={500} style={{ top:-150, right:-100, opacity:0.6 }} />
      <GlassOrb color="#7c3aed" size={400} style={{ bottom:-50, left:-100, opacity:0.4 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto' }}>
        <header style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:24, height:2, background:C.gold2, borderRadius:2 }} />
              <p style={{ fontSize:12, color: C.gold2, fontWeight:800, letterSpacing:'.15em', textTransform:'uppercase', margin:0 }}>Data Insights & Analysis</p>
            </div>
            <h1 style={{ fontSize:36, fontWeight:900, color: C.text, margin:0, letterSpacing:'-0.02em' }}>Ministry <span style={{ color: C.sky }}>Analytics</span></h1>
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border2}`, borderRadius:12, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <FiCalendar style={{ color: C.sub }} size={14} />
            <span style={{ fontSize:13, color: C.text, fontWeight:700 }}>Fiscal Year 2026</span>
          </div>
        </header>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:24, marginBottom:32 }}>
          {[
            { label:'Total Participating', value: totalMembers, sub:'Active Ministry Members', icon: FiUsers, gradient:'linear-gradient(135deg,#1a4fa0,#2563eb)' },
            { label:'Avg Attendance Rate', value: `${avgAttendance}%`, sub:'Across all departments', icon: FiActivity, gradient:'linear-gradient(135deg,#047857,#059669)' },
            { label:'Top Performing', value: topMinistry, sub:'Highest Engagement Rate', icon: FiTarget, gradient:'linear-gradient(135deg,#7c3aed,#a855f7)' },
          ].map(({ label, value, sub, icon: Icon, gradient }) => (
            <div key={label} style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, padding:28, position:'relative', overflow:'hidden', boxShadow:'0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: gradient }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:12, background: gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color: C.sub, fontSize:10, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', margin:0 }}>{label}</p>
                  <p style={{ color: C.text, fontWeight:900, fontSize:24, margin:'4px 0 0 0' }}>{value}</p>
                </div>
              </div>
              <p style={{ color: C.muted, fontSize:12, margin:0, fontWeight:600 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, padding:32, marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.azure }}>
                <FiBarChart2 size={20} />
              </div>
              <h2 style={{ color: C.text, fontWeight:800, fontSize:18, margin:0 }}>Departmental Performance</h2>
            </div>
          </div>
          
          <div style={{ width:'100%', height:320 }}>
            {loading ? (
              <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center' }}>
                <p style={{ color: C.sub }}>Loading Chart...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" tick={{ fill: C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: C.sub, fontSize:11 }} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar yAxisId="left" dataKey="members" name="Members" fill="#2563eb" radius={[6,6,0,0]} barSize={40} />
                  <Bar yAxisId="right" dataKey="avg_attendance" name="Avg Attendance %" fill="#f59e0b" radius={[6,6,0,0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ background: C.panel, border:`1px solid ${C.border2}`, borderRadius:24, overflow:'hidden' }}>
          <div style={{ padding:'24px 32px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:C.lift, display:'flex', alignItems:'center', justifyContent:'center', color:C.sky }}><FiLayers size={18} /></div>
              <h2 style={{ color: C.text, fontWeight:800, fontSize:16, margin:0 }}>Participation Dashboard</h2>
            </div>
          </div>
          
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Member Name','Ministry','Events','Attendance','Last Active'].map((h, i) => (
                    <th key={i} style={{ padding:'18px 24px', textAlign:'left', color: C.sub, fontWeight:800, fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color: C.sub }}>Loading records...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color: C.sub }}>No records found.</td></tr>
                ) : data.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <Avatar name={r.member_name} />
                        <div style={{ color: C.text, fontWeight:700, fontSize:14 }}>{r.member_name}</div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ color: C.text, fontSize:13, fontWeight:700 }}>{r.ministry_name}</div>
                      <div style={{ color: C.sub, fontSize:11 }}>{r.ministry_role}</div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ background:C.lift, width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:C.text, fontSize:12, fontWeight:800 }}>{r.total_events_attended}</div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ flex:1, background: C.lift, borderRadius:100, height:8, overflow:'hidden', minWidth:60 }}>
                          <div style={{ height:8, borderRadius:100, background: r.attendance_rate > 75 ? C.emerald : r.attendance_rate > 40 ? C.azure : C.rose, width:`${Math.min(r.attendance_rate || 0, 100)}%` }} />
                        </div>
                        <span style={{ color: C.text, fontSize:12, fontWeight:800 }}>{r.attendance_rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, color: C.sub, fontSize:13 }}>
                        <FiClock size={12} />
                        {r.last_participation_date ? new Date(r.last_participation_date).toLocaleDateString('en-PH') : '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}