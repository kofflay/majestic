import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const RANKS = [
  { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
  { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
  { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
  { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }
];

export default function ReinstatementForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({ fullName: '' });
  const [formData, setFormData] = useState({
    fullName: '', rankAtDismissal: '', rankProof: '', wasWarned: '', stateFractionsProof: ''
  });

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

  const isFormValid = () => {
    if (!formData.fullName.trim()) return false;
    if (!formData.rankAtDismissal) return false;
    if (!formData.rankProof.trim()) return false;
    if (!formData.wasWarned) return false;
    if (formData.wasWarned === 'yes' && !formData.stateFractionsProof.trim()) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) { window.toast.error('Заполните все обязательные поля!'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reinstatement', fullName: formData.fullName,
          rankAtDismissal: formData.rankAtDismissal, rankProof: formData.rankProof,
          wasWarned: formData.wasWarned, stateFractionsProof: formData.stateFractionsProof
        })
      });
      if (res.ok) { window.toast.success('Заявка на восстановление отправлена!'); router.push('/dashboard'); }
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
            <span style={{ fontSize:'18px' }}>🔄</span> Восстановление
          </div>
          <div style={{ width:'80px' }} />
        </div>
      </div>

      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'0 20px 40px' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, #9C27B0, #9C27B080, transparent)' }} />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Имя Фамилия + Статик * {profile.fullName && <span style={{ color:'#4CAF50', fontSize:'11px', fontWeight:600 }}>(из профиля)</span>}</label>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName:e.target.value})} placeholder="Например: Sanya Suspect 270726" disabled={!!profile.fullName} style={{...s, opacity:profile.fullName?0.5:1}} />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Ранг на момент увольнения *</label>
              <select required value={formData.rankAtDismissal} onChange={e => setFormData({...formData, rankAtDismissal:e.target.value})} style={{...s, appearance:'none', cursor:'pointer'}}>
                <option value="">-- Выберите ранг --</option>
                {RANKS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Доказательство ранга (скриншот планшета) *</label>
              <textarea required value={formData.rankProof} onChange={e => setFormData({...formData, rankProof:e.target.value})} placeholder="Вставьте ссылку на скриншот планшета..." rows="3" style={{...s, resize:'vertical', minHeight:'100px'}} />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Вы были уволены после Ban/Warn? *</label>
              <select required value={formData.wasWarned} onChange={e => setFormData({...formData, wasWarned:e.target.value, stateFractionsProof:''})} style={{...s, appearance:'none', cursor:'pointer'}}>
                <option value="">-- Выберите ответ --</option>
                <option value="yes">✅ Да</option>
                <option value="no">❌ Нет</option>
              </select>
            </div>
            {formData.wasWarned === 'yes' && (
              <div style={{ background:'rgba(156,39,176,0.08)', border:'1px solid rgba(156,39,176,0.25)', borderRadius:'12px', padding:'18px', marginBottom:'20px' }}>
                <label style={lbl}>Скриншот одобрения из State Fractions *</label>
                <textarea required value={formData.stateFractionsProof} onChange={e => setFormData({...formData, stateFractionsProof:e.target.value})} placeholder="Вставьте ссылку на скриншот одобрения..." rows="3" style={{...s, resize:'vertical', minHeight:'100px'}} />
              </div>
            )}
            <div style={{ marginBottom:'20px' }}>
              <label style={lbl}>Discord ID</label>
              <input type="text" value={`${user.username} (${user.id})`} disabled style={{...s, opacity:0.5}} />
            </div>
            <button type="submit" disabled={submitting || !isFormValid()} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #9C27B0, #BA68C8)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:600, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.5:1, marginTop:'10px', boxShadow:'0 4px 12px rgba(156,39,176,0.25)' }}>
              {submitting ? '⏳ Отправка...' : '📤 Отправить заявку'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
