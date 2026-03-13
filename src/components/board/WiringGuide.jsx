import { useState } from 'react';
import useAppStore from '../../stores/appStore';
import SENSORS from '../../data/sensors';
import GLOSSARY from '../../data/glossary';

// 단계별 배선 가이드 — 한 선씩 안내
export default function WiringGuide() {
  const { selectedSensor, shieldMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([]);

  const sensorBase = selectedSensor ? SENSORS[selectedSensor] : null;
  const modeData = sensorBase ? (shieldMode ? sensorBase.shield : sensorBase.direct) : null;

  if (!sensorBase || !modeData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔌</div>
        <div style={{ fontSize: 14 }}>왼쪽에서 센서를 선택하면</div>
        <div style={{ fontSize: 14 }}>단계별 배선 가이드가 나타나요!</div>
      </div>
    );
  }

  const pins = modeData.pins;
  const allChecked = checkedSteps.length === pins.length;

  const toggleCheck = (i) => {
    setCheckedSteps(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  // 용어 설명 (SDA, SCL 등)
  const getTermExplain = (sensorPin) => {
    const g = GLOSSARY[sensorPin];
    if (g) return `${g.emoji} ${g.simple} — ${g.explain}`;
    return null;
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'auto' }}>
      {/* 모드 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#0d1a0d', borderRadius: 8, border: '1px solid #1a2a1a' }}>
        <span style={{ fontSize: 16 }}>{sensorBase.icon}</span>
        <span style={{ fontSize: 13, color: sensorBase.color, fontWeight: 'bold' }}>{sensorBase.name}</span>
        <span style={{ fontSize: 11, color: '#666' }}>
          {shieldMode ? '🛡️ Grove Shield' : '🔌 직접연결'}
        </span>
        <span style={{ fontSize: 11, color: '#555', marginLeft: 'auto' }}>
          {checkedSteps.length}/{pins.length} 완료
        </span>
      </div>

      {/* 진행률 바 */}
      <div style={{ height: 4, background: '#1a1a2e', borderRadius: 2 }}>
        <div style={{
          height: '100%', borderRadius: 2, transition: 'width 0.3s',
          width: `${(checkedSteps.length / pins.length) * 100}%`,
          background: allChecked ? '#00ff88' : sensorBase.color,
        }} />
      </div>

      {/* 단계별 배선 */}
      {pins.map((pin, i) => {
        const checked = checkedSteps.includes(i);
        const isCurrent = i === currentStep;
        const termExplain = getTermExplain(pin.sensor);

        return (
          <div key={i}
            onClick={() => { setCurrentStep(i); toggleCheck(i); }}
            style={{
              background: checked ? '#0a2a0a' : isCurrent ? '#0d1a2e' : '#0d0d1a',
              border: `1px solid ${checked ? '#00ff8844' : isCurrent ? sensorBase.color + '66' : '#1a1a2e'}`,
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: checked ? 0.7 : 1,
            }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* 체크박스 */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: `2px solid ${checked ? '#00ff88' : pin.wire}`,
                background: checked ? '#00ff88' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}>
                {checked && <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>✓</span>}
                {!checked && <span style={{ color: pin.wire, fontSize: 11, fontWeight: 'bold' }}>{i + 1}</span>}
              </div>

              {/* 케이블 색상 바 */}
              <div style={{
                width: 30, height: 6, borderRadius: 3,
                background: pin.wire, boxShadow: `0 0 6px ${pin.wire}60`,
              }} />

              {/* 연결 정보 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#ddd', fontWeight: 'bold' }}>
                  <span style={{ color: pin.wire }}>{pin.label}선</span>
                  {' · '}
                  <span style={{ fontFamily: 'monospace' }}>센서 {pin.sensor}</span>
                  {' → '}
                  <span style={{ fontFamily: 'monospace', color: pin.wire }}>{pin.picoName}</span>
                  <span style={{ color: '#666', fontSize: 10 }}> ({pin.pico}번 핀)</span>
                </div>
              </div>
            </div>

            {/* 용어 설명 (펼쳤을 때) */}
            {isCurrent && termExplain && !checked && (
              <div style={{
                marginTop: 8, padding: '8px 12px', borderRadius: 6,
                background: '#0a0a20', border: '1px solid #1a1a3a',
                fontSize: 11, color: '#aaa', lineHeight: 1.6,
              }}>
                💡 {termExplain}
              </div>
            )}
          </div>
        );
      })}

      {/* 주의사항 */}
      {modeData.warning && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: '#2a1a00', border: '1px solid #ff880044',
          fontSize: 11, color: '#ffaa44',
        }}>
          ⚠️ {modeData.warning}
        </div>
      )}

      {/* 완료 메시지 */}
      {allChecked && (
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: '#0a2a0a', border: '1px solid #00ff8844',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
          <div style={{ fontSize: 13, color: '#00ff88', fontWeight: 'bold' }}>배선 완료!</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
            USB를 연결하기 전에, 빨간선과 검은선이 맞는지 한번 더 확인하세요!
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
            코드 탭으로 이동해서 코드를 실행해보세요 →
          </div>
        </div>
      )}

      {/* 팁 */}
      {modeData.note && (
        <div style={{
          padding: '8px 12px', borderRadius: 6,
          background: '#0a1a0a', border: '1px solid #00ff8822',
          fontSize: 10, color: '#00cc66',
        }}>
          💡 {modeData.note}
        </div>
      )}
    </div>
  );
}
