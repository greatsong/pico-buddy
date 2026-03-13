// 센서별 자주 하는 실수 경고 카드
export default function MistakeWarning({ sensorId, mistakes, onDismiss }) {
  if (!mistakes || mistakes.length === 0) return null;

  const levelStyles = {
    danger: { bg: '#2a0a0a', border: '#ff444466', badge: '#ff4444', badgeText: '위험' },
    warn: { bg: '#2a1a00', border: '#ffaa0066', badge: '#ffaa00', badgeText: '주의' },
    info: { bg: '#0a1a2a', border: '#4488ff66', badge: '#4488ff', badgeText: '팁' },
  };

  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: '95%',
      background: '#0d0d1a', border: '1px solid #ff880033',
      borderRadius: 12, padding: '12px 14px', margin: '4px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ffaa00' }}>
          ⚠️ 이 센서 연결할 때 자주 하는 실수!
        </div>
        <button onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14 }}>×</button>
      </div>

      {mistakes.map((m, i) => {
        const style = levelStyles[m.level] || levelStyles.info;
        return (
          <div key={i} style={{
            background: style.bg, border: `1px solid ${style.border}`,
            borderRadius: 8, padding: '8px 10px', marginBottom: i < mistakes.length - 1 ? 6 : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                fontSize: 9, padding: '1px 6px', borderRadius: 8,
                background: style.badge + '33', border: `1px solid ${style.badge}`,
                color: style.badge,
              }}>{style.badgeText}</span>
              <span style={{ fontSize: 11, fontWeight: 'bold', color: '#ddd' }}>{m.title}</span>
            </div>
            <div style={{ fontSize: 10, color: '#999', lineHeight: 1.5, marginBottom: 4 }}>{m.desc}</div>
            <div style={{
              fontSize: 10, color: '#00ff88', padding: '4px 8px',
              background: '#00ff8811', borderRadius: 4, borderLeft: '2px solid #00ff88',
            }}>
              ✅ {m.fix}
            </div>
          </div>
        );
      })}
    </div>
  );
}
