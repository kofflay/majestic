import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const RANK_OPTIONS = [
  '1-2 ранг', '2-3 ранг', '3-4 ранг', '4-5 ранг', '5-6 ранг',
  '6-7 ранг', '7-8 ранг', '8-9 ранг', '9-10 ранг', '10-11 ранг',
  '11-12 ранг', '12-13 ранг', '13-14 ранг', '14-15 ранг'
];

export default function HighRankReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({ fullName: '' });
  const [formData, setFormData] = useState({ fullName: '', rankRange: '', workLink: '' });

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => {
      if (!data.user) { router.push('/'); return; }
      setUser(data.user);
    });
    fetch('/api/profile').then(res => res.json()).then(data => {
      setProfile(data.profile);
      if (data.profile.fullName) setFormData(prev => ({ ...prev, fullName: data.profile.fullName }));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'highrank', fullName: formData.fullName,
          rankRange: formData.rankRange, workLink: formData.workLink
        })
      });
      if (res.ok) { window.toast.success('Отчёт на повышение отправлен!'); router.push('/dashboard'); }
      else { const error = await res.json(); throw new Error(error.error || 'Ошибка отправки'); }
    } catch (error) { window.toast.error(error.message); }
    finally { setSubmitting(false); }
  };

  if (loading || !user) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#0a0a1a', color:'white' }}>
      <div style={{ width:'50px', height:'50px', border:'4px solid rgba(88,101,242,0.15)', borderTopColor:'#5865F2', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const s = { width:'100%', padding:'12px 15px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', color:'white', fontSize:'15px', boxSizing:'border-box' };
  const lbl = { display:'block', marginBottom:'8px', color:'#8b8ba7', fontSize:'13px', fontWeight:500 };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a0a1a 0%,#1a1a3e 100%)', color:'white' }}>

      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(10,10,26,0.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:'30px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'700px', margin:'0 auto', padding:'16px 20px', gap:'16px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', color:'white', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Назад
          </button>
          <div style={{ fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'18px' }}>🌟</span> Хай Ранги
          </div>
          <div style={{ width:'80px' }} />
        </div>
      </div>

      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'0 20px 40px' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, #FF69B4, #FF69B480, transparent)' }} />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Имя Фамилия + Статик * {profile.fullName && <span style={{ color:'#4CAF50', fontSize:'11px', fontWeight:600 }}>(из профиля)</span>}</label>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName:e.target.value})} placeholder="Например: Sanya Suspect 270726" disabled={!!profile.fullName} style={{...s, opacity:profile.fullName?0.5:1}} />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>С какого на какой ранг вы повышаетесь *</label>
              <select required value={formData.rankRange} onChange={e => setFormData({...formData, rankRange:e.target.value})} style={{...s, appearance:'none', cursor:'pointer'}}>
                <option value="">-- Выберите диапазон --</option>
                {RANK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Ссылка на проделанную работу *</label>
              <textarea required value={formData.workLink} onChange={e => setFormData({...formData, workLink:e.target.value})} placeholder="Вставьте ссылки на ваши отчёты и доказательства..." rows="5" style={{...s, resize:'vertical', minHeight:'120px'}} />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Discord ID</label>
              <input type="text" value={`${user.username} (${user.id})`} disabled style={{...s, opacity:0.5}} />
            </div>
            <button type="submit" disabled={submitting} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #FF69B4, #FF8DC7)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:600, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.5:1, marginTop:'10px', boxShadow:'0 4px 12px rgba(255,105,180,0.25)' }}>
              {submitting ? '⏳ Отправка...' : '📤 Отправить отчёт'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
