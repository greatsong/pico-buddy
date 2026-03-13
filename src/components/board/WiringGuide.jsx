import { useState } from 'react';
import useAppStore from '../../stores/appStore';
import SENSORS from '../../data/sensors';
import GLOSSARY from '../../data/glossary';

// 단계별 배선 가이드 — Grove Shield / 직접연결 완전 분리
export default function WiringGuide() {
  const { selectedSensor, shieldMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [showPinDetail, setShowPinDetail] = useState(false);
  const [groveChecked, setGroveChecked] = useState(false);

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

  const getTermExplain = (sensorPin) => {
    const g = GLOSSARY[sensorPin];
    if (g) return `${g.emoji} ${g.simple} — ${g.explain}`;
    return null;
  };

  // I2C 센서인지 확인 (풀업 저항 필요 여부)
  const isI2C = sensorBase.protocol === 'I2C';
  const needsPullup = !shieldMode && isI2C && modeData.warning?.includes('풀업');

  // ═══════════ Grove Shield 모드 ═══════════
  if (shieldMode && modeData.grovePort) {
    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'auto' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#0d1a0d', borderRadius: 8, border: '1px solid #1a2a1a' }}>
          <span style={{ fontSize: 16 }}>{sensorBase.icon}</span>
          <span style={{ fontSize: 13, color: sensorBase.color, fontWeight: 'bold' }}>{sensorBase.name}</span>
          <span style={{ fontSize: 11, color: '#00ff88' }}>🛡️ Grove Shield</span>
        </div>

        {/* 메인: Grove 포트 연결 1단계 */}
        <div
          onClick={() => setGroveChecked(!groveChecked)}
          style={{
            background: groveChecked ? '#0a2a0a' : '#0a1a2e',
            border: `2px solid ${groveChecked ? '#00ff88' : modeData.grovePort.color}66`,
            borderRadius: 12, padding: 20, cursor: 'pointer',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
          }}>
          {/* 배경 데코 */}
          <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.04 }}>🛡️</div>

          {/* Step 1 배지 */}
          <div style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 12,
            background: groveChecked ? '#00ff8822' : modeData.grovePort.color + '22',
            color: groveChecked ? '#00ff88' : modeData.grovePort.color,
            fontSize: 10, fontWeight: 'bold', marginBottom: 12,
          }}>
            {groveChecked ? '✓ 완료' : 'STEP 1 — 이것만 하면 끝!'}
          </div>

          {/* 포트 시각화 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
          }}>
            {/* Grove 커넥터 */}
            <div style={{
              width: 64, height: 44, borderRadius: 8,
              background: groveChecked ? '#00ff8822' : modeData.grovePort.color + '18',
              border: `3px solid ${groveChecked ? '#00ff88' : modeData.grovePort.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: 16, color: groveChecked ? '#00ff88' : modeData.grovePort.color,
              fontFamily: 'monospace', transition: 'all 0.3s',
            }}>
              {groveChecked ? '✓' : modeData.grovePort.name}
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 'bold', color: '#eee' }}>
                <span style={{ color: modeData.grovePort.color }}>{modeData.grovePort.name}</span> 포트에 꽂기
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>
                {modeData.grovePort.type} 포트 · Grove 케이블 사용
              </div>
            </div>
          </div>

          {/* 상세 안내 */}
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: '#0d0d1a', border: '1px solid #1a1a3a',
            fontSize: 11, color: '#aaa', lineHeight: 1.8,
          }}>
            <div style={{ marginBottom: 6, color: '#ddd', fontWeight: 'bold' }}>연결 방법:</div>
            <div>1. Grove 케이블(4선 리본 케이블)을 준비하세요</div>
            <div>2. 센서 쪽 Grove 커넥터에 한쪽 끝을 꽂으세요</div>
            <div>3. Shield의 <strong style={{ color: modeData.grovePort.color }}>{modeData.grovePort.name}</strong> 포트에 다른 쪽을 꽂으세요</div>
            <div>4. 딸깍 소리가 나면 완료!</div>
          </div>
        </div>

        {/* Grove 장점 안내 */}
        <div style={{
          padding: '12px 14px', borderRadius: 8,
          background: '#0a1a0a', border: '1px solid #00ff8822',
          fontSize: 10, color: '#6a6', lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#00cc66' }}>🛡️ Grove Shield의 장점</div>
          <div>✅ 커넥터가 방향이 정해져 있어서 잘못 꽂을 수 없어요</div>
          <div>✅ 납땜이나 브레드보드가 필요 없어요</div>
          {isI2C && <div>✅ 풀업 저항이 내장되어 있어서 따로 연결할 필요 없어요</div>}
          <div>✅ 딸깍 소리가 나면 제대로 꽂힌 거예요</div>
        </div>

        {/* 완료 */}
        {groveChecked && (
          <div style={{
            padding: '14px 16px', borderRadius: 10,
            background: '#0a2a0a', border: '1px solid #00ff8844',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, color: '#00ff88', fontWeight: 'bold' }}>연결 완료!</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
              USB 케이블로 Pico를 컴퓨터에 연결하세요
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
              코드 탭으로 이동해서 코드를 실행해보세요 →
            </div>
          </div>
        )}

        {/* 핀 매핑 (접이식 참고용) */}
        <div>
          <button
            onClick={() => setShowPinDetail(!showPinDetail)}
            style={{
              background: 'transparent', border: '1px solid #1a1a2e', borderRadius: 6,
              padding: '6px 12px', color: '#555', fontSize: 10, cursor: 'pointer', width: '100%',
            }}>
            {showPinDetail ? '▼' : '▶'} 실제 핀 매핑 보기 (고급)
          </button>
          {showPinDetail && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#0a0a14', borderRadius: 8, border: '1px solid #1a1a2e' }}>
              <div style={{ fontSize: 9, color: '#555', marginBottom: 6 }}>Grove 케이블 내부 배선 (자동 연결됨)</div>
              {pins.map((pin, i) => (
                <div key={i} style={{ fontSize: 10, color: '#666', padding: '2px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 16, height: 3, borderRadius: 2, background: pin.wire }} />
                  <span>{pin.label}선</span>
                  <span style={{ color: '#444' }}>·</span>
                  <span style={{ fontFamily: 'monospace' }}>{pin.sensor} → {pin.picoName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════ 직접연결 모드 ═══════════
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'auto' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#0d1a0d', borderRadius: 8, border: '1px solid #1a2a1a' }}>
        <span style={{ fontSize: 16 }}>{sensorBase.icon}</span>
        <span style={{ fontSize: 13, color: sensorBase.color, fontWeight: 'bold' }}>{sensorBase.name}</span>
        <span style={{ fontSize: 11, color: '#ffaa44' }}>🔌 직접연결</span>
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

      {/* 브레드보드 + 풀업 저항 가이드 (I2C 직접연결) */}
      {needsPullup && (
        <div style={{
          background: '#1a1a00', border: '1px solid #ffaa0033',
          borderRadius: 10, padding: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ffaa44', marginBottom: 10 }}>
            ⚡ 브레드보드 풀업 저항 연결 (필수!)
          </div>

          {/* 저항 색띠 안내 */}
          <div style={{
            background: '#0d0d1a', borderRadius: 8, padding: 12,
            border: '1px solid #1a1a3a', marginBottom: 10,
          }}>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>4.7kΩ 저항 찾는 법 — 색띠 읽기:</div>
            {/* 저항 시각화 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 10 }}>
              {/* 저항 왼쪽 다리 */}
              <div style={{ width: 30, height: 2, background: '#999' }} />
              {/* 저항 몸체 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: '#d2b48c', borderRadius: 6, padding: '6px 4px',
                border: '1px solid #a08060',
                height: 28,
              }}>
                {/* 1번 띠: 노랑(4) */}
                <div style={{ width: 8, height: 22, background: '#FFD700', borderRadius: 1, margin: '0 3px' }} title="노랑 = 4" />
                {/* 2번 띠: 보라(7) */}
                <div style={{ width: 8, height: 22, background: '#8B00FF', borderRadius: 1, margin: '0 3px' }} title="보라 = 7" />
                {/* 3번 띠: 빨강(×100) */}
                <div style={{ width: 8, height: 22, background: '#FF0000', borderRadius: 1, margin: '0 3px' }} title="빨강 = ×100" />
                {/* 4번 띠: 금(±5%) */}
                <div style={{ width: 8, height: 22, background: '#DAA520', borderRadius: 1, margin: '0 6px 0 10px' }} title="금 = ±5%" />
              </div>
              {/* 저항 오른쪽 다리 */}
              <div style={{ width: 30, height: 2, background: '#999' }} />
            </div>
            {/* 색띠 설명 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              {[
                { color: '#FFD700', border: '#b8a000', name: '노랑', value: '4' },
                { color: '#8B00FF', border: '#6600bb', name: '보라', value: '7' },
                { color: '#FF0000', border: '#bb0000', name: '빨강', value: '×100' },
                { color: '#DAA520', border: '#a08020', name: '금', value: '±5%' },
              ].map((band, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: band.color, border: `1px solid ${band.border}`,
                  }} />
                  <span style={{ color: '#bbb' }}>{band.name}</span>
                  <span style={{ color: '#888' }}>({band.value})</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#ffcc66', marginTop: 8 }}>
              4 × 7 × 100 = <strong>4,700Ω = 4.7kΩ</strong>
            </div>
          </div>

          {/* 시각적 브레드보드 가이드 */}
          <div style={{
            background: '#0d0d1a', borderRadius: 8, padding: 12,
            border: '1px solid #1a1a3a', fontSize: 10,
            lineHeight: 1.6, color: '#ccc',
          }}>
            <div style={{ color: '#888', marginBottom: 8, fontSize: 9 }}>브레드보드 배치도:</div>
            {/* SDA 풀업 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: '#ff444422', padding: '2px 8px', borderRadius: 4,
                border: '1px solid #ff444444',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444' }} />
                <span style={{ color: '#ff6666', fontWeight: 'bold', fontFamily: 'monospace' }}>3.3V</span>
              </div>
              <span style={{ color: '#555' }}>───</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 2,
                background: '#ffaa4422', padding: '2px 6px', borderRadius: 4,
                border: '1px solid #ffaa4444',
              }}>
                <div style={{ width: 4, height: 10, background: '#FFD700', borderRadius: 1 }} />
                <div style={{ width: 4, height: 10, background: '#8B00FF', borderRadius: 1 }} />
                <div style={{ width: 4, height: 10, background: '#FF0000', borderRadius: 1 }} />
                <span style={{ color: '#ffaa44', fontFamily: 'monospace', marginLeft: 2 }}>4.7kΩ</span>
              </div>
              <span style={{ color: '#555' }}>───</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: '#ffdd0022', padding: '2px 8px', borderRadius: 4,
                border: '1px solid #ffdd0044',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffdd00' }} />
                <span style={{ color: '#ffdd00', fontWeight: 'bold', fontFamily: 'monospace' }}>SDA (GP6)</span>
              </div>
            </div>
            {/* SCL 풀업 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: '#ff444422', padding: '2px 8px', borderRadius: 4,
                border: '1px solid #ff444444',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444' }} />
                <span style={{ color: '#ff6666', fontWeight: 'bold', fontFamily: 'monospace' }}>3.3V</span>
              </div>
              <span style={{ color: '#555' }}>───</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 2,
                background: '#ffaa4422', padding: '2px 6px', borderRadius: 4,
                border: '1px solid #ffaa4444',
              }}>
                <div style={{ width: 4, height: 10, background: '#FFD700', borderRadius: 1 }} />
                <div style={{ width: 4, height: 10, background: '#8B00FF', borderRadius: 1 }} />
                <div style={{ width: 4, height: 10, background: '#FF0000', borderRadius: 1 }} />
                <span style={{ color: '#ffaa44', fontFamily: 'monospace', marginLeft: 2 }}>4.7kΩ</span>
              </div>
              <span style={{ color: '#555' }}>───</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: '#ffffff11', padding: '2px 8px', borderRadius: 4,
                border: '1px solid #ffffff22',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dddddd' }} />
                <span style={{ color: '#dddddd', fontWeight: 'bold', fontFamily: 'monospace' }}>SCL (GP7)</span>
              </div>
            </div>
          </div>

          {/* 단계별 설명 */}
          <div style={{ marginTop: 10, fontSize: 10, color: '#bba', lineHeight: 1.8 }}>
            <div style={{ fontWeight: 'bold', color: '#ffcc66', marginBottom: 4 }}>연결 순서:</div>
            <div>1. 부품함에서 <strong style={{ color: '#ffaa44' }}>노랑-보라-빨강-금</strong> 색띠의 저항 2개를 찾으세요</div>
            <div>2. 브레드보드의 한 행에 저항을 꽂으세요</div>
            <div>3. 저항의 한쪽 다리를 <strong style={{ color: '#ff4444' }}>3.3V 전원 라인</strong>(+행)에 연결</div>
            <div>4. 저항의 다른 다리를 <strong style={{ color: '#ffdd00' }}>SDA 라인</strong> (GP6과 같은 행)에 연결</div>
            <div>5. 같은 방법으로 두 번째 저항을 <strong style={{ color: '#ddd' }}>SCL 라인</strong> (GP7)에 연결</div>
          </div>

          <div style={{
            marginTop: 10, padding: '6px 10px', borderRadius: 6,
            background: '#0a1a2e', border: '1px solid #0066ff22',
            fontSize: 9, color: '#88aadd',
          }}>
            💡 풀업 저항은 I2C 통신 신호를 안정시켜요. 없으면 센서와 Pico가 대화를 못해요!
            <br />💡 Grove Shield를 쓰면 이 저항이 내장되어 있어서 필요 없어요.
          </div>
        </div>
      )}

      {/* 단계별 배선 */}
      <div style={{ fontSize: 11, color: '#666' }}>📌 점퍼선 연결</div>
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
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                border: `2px solid ${checked ? '#00ff88' : pin.wire}`,
                background: checked ? '#00ff88' : pin.wire + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                boxShadow: isCurrent && !checked ? `0 0 8px ${pin.wire}44` : 'none',
              }}>
                {checked && <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>✓</span>}
                {!checked && <span style={{ color: pin.wire, fontSize: 11, fontWeight: 'bold' }}>{i + 1}</span>}
              </div>

              {/* 선 색상 시각화 — 더 눈에 띄게 */}
              <div style={{
                width: 36, height: 10, borderRadius: 5,
                background: `linear-gradient(90deg, ${pin.wire}, ${pin.wire}88)`,
                boxShadow: `0 0 8px ${pin.wire}50`,
                border: `1px solid ${pin.wire}66`,
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#ddd', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    color: pin.wire, background: pin.wire + '18',
                    padding: '1px 6px', borderRadius: 4,
                    border: `1px solid ${pin.wire}44`,
                    fontSize: 11,
                  }}>{pin.label}선</span>
                  <span style={{ color: '#555' }}>·</span>
                  <span style={{ fontFamily: 'monospace', color: '#aaa', fontSize: 11 }}>센서 {pin.sensor}</span>
                  <span style={{ color: '#00ff88' }}>→</span>
                  <span style={{
                    fontFamily: 'monospace', color: pin.wire,
                    fontWeight: 'bold', fontSize: 11,
                  }}>{pin.picoName}</span>
                  <span style={{ color: '#555', fontSize: 9 }}>({pin.pico}번)</span>
                </div>
              </div>
            </div>

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
      {modeData.warning && !needsPullup && (
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
