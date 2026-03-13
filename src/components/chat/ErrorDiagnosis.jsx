import useAppStore from '../../stores/appStore';

// 에러 자동 진단 카드
export default function ErrorDiagnosis({ diagnosis }) {
  const { setActiveTab } = useAppStore();

  if (!diagnosis) return null;

  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: '95%',
      background: '#2a0a0a', border: '1px solid #ff444444',
      borderRadius: 12, padding: '14px 16px', margin: '4px 0',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{diagnosis.emoji}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6666' }}>
            {diagnosis.cause}
          </div>
        </div>
      </div>

      {/* 설명 */}
      <div style={{ fontSize: 11, color: '#ccaaaa', lineHeight: 1.6, marginBottom: 10 }}>
        {diagnosis.explain}
      </div>

      {/* 해결 방법 */}
      <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>해결 방법:</div>
      {diagnosis.solutions.map((sol, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '6px 10px', borderRadius: 6,
          background: '#0a1a0a', marginBottom: 4,
          fontSize: 11, color: '#aaffaa',
        }}>
          <span style={{ color: '#00ff88', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}.</span>
          <span>{sol}</span>
        </div>
      ))}

      {/* 탭 이동 */}
      {diagnosis.tab && (
        <button
          onClick={() => setActiveTab(diagnosis.tab === 'wiring' ? 'wiring' : 'code')}
          style={{
            marginTop: 8, padding: '6px 14px', borderRadius: 6,
            background: '#00ff8822', border: '1px solid #00ff8844',
            color: '#00ff88', fontSize: 11, cursor: 'pointer',
          }}>
          {diagnosis.tab === 'wiring' ? '🔌 배선 가이드에서 확인하기' : '💻 코드 탭에서 확인하기'}
        </button>
      )}
    </div>
  );
}
