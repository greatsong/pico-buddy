import { useState } from 'react';
import useAppStore from '../../stores/appStore';
import SENSORS from '../../data/sensors';
import GLOSSARY from '../../data/glossary';

// ═══ 준비물 체크리스트 컴포넌트 ═══
function PrepChecklist({ sensorBase, pins, shieldMode, isI2C, needsPullup, grovePort }) {
  const [showPrep, setShowPrep] = useState(true);

  // 준비물 목록 생성
  const items = [];
  if (shieldMode) {
    items.push({ icon: '🟢', name: sensorBase.name + ' 모듈', qty: '1개', desc: '오늘 사용할 센서/액추에이터' });
    items.push({ icon: '🔌', name: 'Grove 4핀 케이블', qty: '1개', desc: '리본 형태 4색 케이블 (보통 센서에 포함)' });
    items.push({ icon: '🛡️', name: 'Grove Shield', qty: '1개', desc: 'Pico WH에 미리 장착되어 있어야 해요' });
    items.push({ icon: '🔋', name: 'USB 케이블 (Micro-B)', qty: '1개', desc: 'Pico를 컴퓨터에 연결할 때 사용' });
  } else {
    items.push({ icon: '🟢', name: sensorBase.name + ' 모듈', qty: '1개', desc: '오늘 사용할 센서/액추에이터' });
    items.push({ icon: '🍞', name: '브레드보드', qty: '1개', desc: '부품과 선을 꽂는 판 (납땜 필요 없음)' });
    // 점퍼선 — 색상별 개수
    const wireColors = {};
    pins.forEach(p => {
      const key = p.label + '(' + p.wire + ')';
      wireColors[key] = (wireColors[key] || 0) + 1;
    });
    const totalWires = pins.length;
    items.push({
      icon: '🔗', name: '점퍼선 (수-수)', qty: `${totalWires}개`,
      desc: pins.map(p => `${p.label}선`).join(', '),
      colors: pins.map(p => p.wire),
    });
    if (needsPullup) {
      items.push({ icon: '⚡', name: '4.7kΩ 저항', qty: '2개', desc: '색띠: 노랑-보라-빨강-금 (I2C 풀업용)', highlight: true });
    }
    items.push({ icon: '🔋', name: 'USB 케이블 (Micro-B)', qty: '1개', desc: 'Pico를 컴퓨터에 연결' });
  }

  return (
    <div style={{
      background: '#0d0d1a', borderRadius: 10, padding: 12,
      border: '1px solid #1a1a3a',
    }}>
      <button
        onClick={() => setShowPrep(!showPrep)}
        style={{
          background: 'transparent', border: 'none', color: '#aaa',
          fontSize: 11, fontWeight: 'bold', cursor: 'pointer', width: '100%',
          textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ color: '#ffaa44' }}>📋</span>
        준비물 체크리스트 ({items.length}가지)
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#666' }}>{showPrep ? '▼' : '▶'}</span>
      </button>

      {showPrep && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              borderRadius: 8, background: item.highlight ? '#1a1a00' : '#0a0a14',
              border: `1px solid ${item.highlight ? '#ffaa0033' : '#1a1a2e'}`,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: item.highlight ? '#ffcc66' : '#ddd', fontWeight: 'bold' }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: 10, padding: '1px 6px', borderRadius: 4,
                    background: item.highlight ? '#ffaa0022' : '#ffffff08',
                    color: item.highlight ? '#ffaa44' : '#888',
                    fontWeight: 'bold',
                  }}>×{item.qty}</span>
                </div>
                <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>{item.desc}</div>
                {item.colors && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {item.colors.map((c, ci) => (
                      <div key={ci} style={{
                        width: 24, height: 6, borderRadius: 3,
                        background: c, border: `1px solid ${c}66`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {needsPullup && (
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              background: '#1a1a00', border: '1px solid #ffaa0022',
              fontSize: 10, color: '#bba', lineHeight: 1.6,
            }}>
              <span style={{ fontWeight: 'bold', color: '#ffcc66' }}>💡 4.7kΩ 저항 찾는 법:</span> 색띠가{' '}
              <span style={{ color: '#FFD700' }}>노랑</span>-
              <span style={{ color: '#bb88ff' }}>보라</span>-
              <span style={{ color: '#ff4444' }}>빨강</span>-
              <span style={{ color: '#DAA520' }}>금</span> 순서인 저항이에요.
              (4×7×100 = 4,700Ω)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══ 통합 브레드보드 SVG ═══
function UnifiedBreadboardSVG({ pins, sensorBase, needsPullup }) {
  const colW = 26;

  // 열 배치 결정
  let pinCols, totalCols, resistorPairs = [];

  if (needsPullup && pins.length === 4) {
    // I2C 4핀: VCC, GND, SDA, SCL + 저항 전원 열
    pinCols = pins.map(p => {
      if (p.sensor === 'VCC' || p.sensor === '3.3V') return 2;
      if (p.sensor === 'GND') return 5;
      if (p.sensor === 'SDA') return 9;
      if (p.sensor === 'SCL') return 13;
      return 2;
    });
    resistorPairs = [
      { powerCol: 8, signalCol: 9, label: 'R1' },
      { powerCol: 12, signalCol: 13, label: 'R2' },
    ];
    totalCols = 16;
  } else {
    // 비-I2C 또는 다른 핀 수: 3열 간격 배치
    pinCols = pins.map((_, i) => 2 + i * 3);
    totalCols = Math.max(pins.length * 3 + 4, 12);
  }

  const picoAreaW = 110;
  const svgW = 40 + totalCols * colW + picoAreaW;
  const railH = needsPullup ? 44 : 0;
  const sensorY = railH + 12;
  const sensorH = 28;
  const bbTop = sensorY + sensorH + 16;
  const bbRowH = 14;
  const bbRows = 5;
  const bbBottom = bbTop + (bbRows - 1) * bbRowH;
  const dividerY = bbBottom + 12;
  const wireAreaTop = dividerY + 16;
  const picoX = svgW - picoAreaW + 10;
  const picoH = Math.max(pins.length * 28 + 20, 80);
  const legendY = wireAreaTop + picoH + 10;
  const svgH = legendY + (needsPullup ? 50 : 30);

  const cx = (col) => 30 + col * colW;
  const ry = (row) => bbTop + row * bbRowH;

  // 특수 열 확인 헬퍼
  const isResistorPowerCol = (col) => resistorPairs.some(r => r.powerCol === col);
  const isActiveCol = (col) => pinCols.includes(col) || isResistorPowerCol(col);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto' }}>
      <defs>
        {pins.map((pin, i) => (
          <filter key={`glow${i}`} id={`glow-${i}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={pin.wire} floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
        <filter id="glowOrange" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#ffaa44" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ═══ 브레드보드 배경 ═══ */}
      <rect x="10" y="8" width={svgW - picoAreaW - 10} height={dividerY + 8 - 8} rx="8"
        fill="#f5f0e0" stroke="#d0c8a0" strokeWidth="2" />

      {/* ═══ 전원 레일 (I2C만) ═══ */}
      {needsPullup && (
        <>
          {/* + 레일 */}
          <rect x="20" y="16" width={svgW - picoAreaW - 30} height="3" rx="1" fill="#ff4444" opacity="0.6" />
          <text x="14" y="22" fontSize="8" fill="#ff4444" fontWeight="bold" fontFamily="monospace">+</text>
          <text x={svgW - picoAreaW - 14} y="22" fontSize="7" fill="#ff4444" textAnchor="end">3.3V</text>
          {/* - 레일 */}
          <rect x="20" y="32" width={svgW - picoAreaW - 30} height="3" rx="1" fill="#555" opacity="0.5" />
          <text x="14" y="38" fontSize="8" fill="#666" fontWeight="bold" fontFamily="monospace">−</text>
          <text x={svgW - picoAreaW - 14} y="38" fontSize="7" fill="#666" textAnchor="end">GND</text>

          {/* 전원 레일 개별 홀은 표시하지 않음 — 레일 막대 자체가 연결선 역할 */}
          {/* 레일 막대는 위에서 rect로 이미 그려짐 (+ 빨강, - 검정) */}
        </>
      )}

      {/* ═══ 센서 모듈 ═══ */}
      {(() => {
        const firstCol = Math.min(...pinCols);
        const lastCol = Math.max(...pinCols);
        const modX = cx(firstCol) - 12;
        const modW = cx(lastCol) - cx(firstCol) + 24;
        return (
          <g>
            <rect x={modX} y={sensorY} width={modW} height={sensorH} rx="5"
              fill="#1a3322" stroke={sensorBase.color + '88'} strokeWidth="1.5" />
            <text x={modX + modW / 2} y={sensorY + 17} fontSize="9"
              fill={sensorBase.color} textAnchor="middle" fontWeight="bold">
              {sensorBase.icon} {sensorBase.name}
            </text>
            {/* 센서 핀 다리 */}
            {pins.map((pin, i) => {
              const isVCC = needsPullup && (pin.sensor === 'VCC' || pin.sensor === '3.3V');
              const isGND = needsPullup && pin.sensor === 'GND';
              const railY = isVCC ? 18 : isGND ? 34 : null;
              return (
                <g key={`sp${i}`}>
                  {/* 센서 → row a: 진한 실선 */}
                  <line x1={cx(pinCols[i])} y1={sensorY + sensorH}
                    x2={cx(pinCols[i])} y2={ry(0) - 2}
                    stroke={pin.wire} strokeWidth="2.5" strokeLinecap="round" />
                  {/* 전원핀: row a → 레일까지 연한 실선 */}
                  {railY != null && (
                    <line x1={cx(pinCols[i])} y1={ry(0)} x2={cx(pinCols[i])} y2={railY}
                      stroke={pin.wire} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                  )}
                  <text x={cx(pinCols[i])} y={sensorY + sensorH + 8}
                    fontSize="6" fill={pin.wire} textAnchor="middle" fontWeight="bold">
                    {pin.sensor}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* ═══ 열 번호 ═══ */}
      {Array.from({ length: totalCols }, (_, col) => (
        <text key={`cn${col}`} x={cx(col)} y={ry(0) - 6} fontSize="6"
          fill={isActiveCol(col) ? '#888' : '#ccc8a8'} textAnchor="middle">
          {col + 1}
        </text>
      ))}

      {/* ═══ 행 라벨 ═══ */}
      {['a', 'b', 'c', 'd', 'e'].map((l, ri) => (
        <text key={`rl${l}`} x="22" y={ry(ri) + 3.5} fontSize="7" fill="#aaa89a" textAnchor="middle">{l}</text>
      ))}

      {/* ═══ 열 하이라이트 스트립 ═══ */}
      {pinCols.map((col, i) => (
        <rect key={`strip${i}`} x={cx(col) - 6} y={ry(0) - 4} width="12" height={bbRows * bbRowH + 4}
          rx="4" fill={pins[i].wire} opacity="0.08" />
      ))}
      {resistorPairs.map((r, i) => (
        <rect key={`rstrip${i}`} x={cx(r.powerCol) - 6} y={ry(0) - 4} width="12" height={bbRows * bbRowH + 4}
          rx="4" fill="#ff4444" opacity="0.06" />
      ))}

      {/* ═══ 브레드보드 구멍 — 실제 꽂히는 곳만 점 표시 ═══ */}
      {Array.from({ length: bbRows }, (_, row) =>
        Array.from({ length: totalCols }, (_, col) => {
          const x = cx(col);
          const y = ry(row);
          const pIdx = pinCols.indexOf(col);
          const isRPow = isResistorPowerCol(col);
          const isConnected = pIdx >= 0 || isRPow;

          // 연결 안 된 열: 거의 안 보임
          if (!isConnected) {
            return (
              <circle key={`h${row}-${col}`} cx={x} cy={y} r={1.5}
                fill="#d8d4c0" stroke="none" opacity="0.1" />
            );
          }

          const pinColor = pIdx >= 0 ? pins[pIdx].wire : '#ff4444';

          // 핀 열: row a(센서핀), row e(점퍼선 출발) — 선이 있는 곳만 점
          if (pIdx >= 0) {
            const pin = pins[pIdx];
            const isPowerPin = needsPullup && (pin.sensor === 'VCC' || pin.sensor === '3.3V' || pin.sensor === 'GND');
            // row a: 센서 핀이 꽂힘 → 항상 표시 (위에서 센서 다리 선이 내려옴)
            if (row === 0) {
              return (
                <circle key={`h${row}-${col}`} cx={x} cy={y} r={5}
                  fill={pinColor} stroke="#fff" strokeWidth="1.8" opacity="1" />
              );
            }
            // row e: 점퍼선 출발점 → 전원핀(I2C)은 레일로 가므로 여기 점 없음
            if (row === 4 && !isPowerPin) {
              return (
                <circle key={`h${row}-${col}`} cx={x} cy={y} r={5}
                  fill={pinColor} stroke="#fff" strokeWidth="1.8" opacity="1" />
              );
            }
            return null;
          }

          // 저항 전원열: row a(전원레일 연결점)만 점 표시
          if (isRPow) {
            if (row === 0) {
              return (
                <circle key={`h${row}-${col}`} cx={x} cy={y} r={4}
                  fill="#ff4444" stroke="#fff" strokeWidth="1.2" opacity="0.9" />
              );
            }
            return null;
          }

          return null;
        })
      )}

      {/* ═══ 열 내부 연결 (세로 연한 실선) — row a↔row e 사이 통전 표시 ═══ */}
      {pinCols.map((col, i) => {
        const pin = pins[i];
        const isPowerPin = needsPullup && (pin.sensor === 'VCC' || pin.sensor === '3.3V' || pin.sensor === 'GND');
        // 전원핀(I2C): row a~e 내부선 불필요 (레일로 연결됨)
        if (isPowerPin) return null;
        // 신호핀: row a(센서) → row e(점퍼선) 연결 표시
        return (
          <line key={`vl${i}`} x1={cx(col)} y1={ry(0)} x2={cx(col)} y2={ry(4)}
            stroke={pin.wire} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        );
      })}
      {resistorPairs.map((r, i) => (
        <line key={`rvl${i}`} x1={cx(r.powerCol)} y1={ry(0)} x2={cx(r.powerCol)} y2={ry(4)}
          stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      ))}

      {/* ═══ 풀업 저항 (I2C만) — row b에 가로로 놓임 ═══ */}
      {resistorPairs.map((r, ri) => {
        const x1 = cx(r.powerCol);
        const x2 = cx(r.signalCol);
        const y = ry(1); // b행
        const bodyW = x2 - x1;
        return (
          <g key={`res${ri}`}>
            {/* 저항 전원열 → +레일 연한 연결 */}
            <line x1={x1} y1={ry(0)} x2={x1} y2="18" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            {/* 왼쪽 다리 (3.3V 열) */}
            <line x1={x1} y1={ry(0)} x2={x1} y2={y} stroke="#999" strokeWidth="1.5" />
            {/* 저항 몸체 */}
            <rect x={x1 - 2} y={y - 5} width={bodyW + 4} height="10" rx="4"
              fill="#d2b48c" stroke="#a08060" strokeWidth="0.8" />
            {/* 색띠 */}
            <rect x={x1 + bodyW * 0.15} y={y - 4} width="3" height="8" rx="0.5" fill="#FFD700" />
            <rect x={x1 + bodyW * 0.35} y={y - 4} width="3" height="8" rx="0.5" fill="#8B00FF" />
            <rect x={x1 + bodyW * 0.55} y={y - 4} width="3" height="8" rx="0.5" fill="#FF0000" />
            <rect x={x1 + bodyW * 0.8} y={y - 4} width="3" height="8" rx="0.5" fill="#DAA520" />
            {/* 오른쪽 다리 (신호 열) */}
            <line x1={x2} y1={ry(0)} x2={x2} y2={y} stroke="#999" strokeWidth="1.5" />
            {/* 라벨 */}
            <text x={x1 + bodyW / 2} y={y - 8} fontSize="6" fill="#ffaa44"
              textAnchor="middle" fontWeight="bold">{r.label} (4.7kΩ)</text>
          </g>
        );
      })}

      {/* ═══ 중앙 분리대 ═══ */}
      <rect x="15" y={dividerY} width={svgW - picoAreaW - 20} height="6" rx="2" fill="#e8e0c8" />

      {/* ═══ 점퍼선 → Pico ═══ */}
      {(() => {
        // I2C 모드: VCC/GND는 전원 레일에서 Pico로 1개씩, SDA/SCL만 직접 점퍼
        // 비-I2C 모드: 모든 핀이 직접 점퍼
        const isPower = (p) => needsPullup && (p.sensor === 'VCC' || p.sensor === '3.3V' || p.sensor === 'GND');
        const wireItems = [];

        if (needsPullup) {
          // 전원 레일 → Pico 점퍼 (빨강: +레일→3V3, 검정: -레일→GND)
          const vccPin = pins.find(p => p.sensor === 'VCC' || p.sensor === '3.3V');
          const gndPin = pins.find(p => p.sensor === 'GND');
          if (vccPin) wireItems.push({ pin: vccPin, pinIdx: pins.indexOf(vccPin), fromY: 18, isRail: true });
          if (gndPin) wireItems.push({ pin: gndPin, pinIdx: pins.indexOf(gndPin), fromY: 34, isRail: true });
          // SDA/SCL → Pico 점퍼 (브레드보드 e행에서 출발)
          pins.forEach((p, idx) => {
            if (!isPower(p)) wireItems.push({ pin: p, pinIdx: idx, fromY: null, isRail: false });
          });
        } else {
          pins.forEach((p, idx) => wireItems.push({ pin: p, pinIdx: idx, fromY: null, isRail: false }));
        }

        return wireItems.map((item, i) => {
          const { pin, pinIdx } = item;
          const sX = cx(pinCols[pinIdx]);
          const picoY = wireAreaTop + 20 + i * 28;
          const startY = item.isRail ? item.fromY : ry(4);
          const startX = item.isRail ? svgW - picoAreaW - 20 : sX;

          return (
            <g key={`wire${i}`}>
              {/* 점퍼선 곡선 */}
              <path
                d={item.isRail
                  ? `M ${startX} ${startY} C ${startX + 30} ${startY}, ${picoX - 60} ${picoY}, ${picoX - 8} ${picoY}`
                  : `M ${sX} ${startY} L ${sX} ${dividerY + 3} C ${sX + 20} ${picoY}, ${picoX - 50} ${picoY}, ${picoX - 8} ${picoY}`
                }
                stroke={pin.wire} strokeWidth="3" fill="none" strokeLinecap="round"
                opacity="0.7"
              />
              {/* 레일 시작점 표시 */}
              {item.isRail && (
                <circle cx={startX} cy={startY} r="4" fill={pin.wire} stroke="#fff" strokeWidth="1" />
              )}
              {/* 선 라벨 */}
              <rect x={(startX + picoX) / 2 - 26} y={picoY - 7} width="52" height="13" rx="4"
                fill="#0d0d1a" stroke={pin.wire + '66'} strokeWidth="1" />
              <text x={(startX + picoX) / 2} y={picoY + 3} fontSize="7" fill={pin.wire}
                textAnchor="middle" fontWeight="bold">
                {item.isRail ? `${pin.label} (레일→)` : `${pin.label}선`}
              </text>
              {/* Pico 연결점 */}
              <circle cx={picoX - 8} cy={picoY} r="4" fill={pin.wire} stroke="#fff" strokeWidth="1.2" />
              {/* Pico 핀 박스 */}
              <rect x={picoX} y={picoY - 10} width="72" height="20" rx="4"
                fill={pin.wire + '18'} stroke={pin.wire} strokeWidth="1.2" />
              <text x={picoX + 36} y={picoY + 4} fontSize="8" fill="#fff"
                textAnchor="middle" fontWeight="bold" fontFamily="monospace">{pin.picoName}</text>
              <text x={picoX + 36} y={picoY - 12} fontSize="5.5" fill="#aaa" textAnchor="middle">
                {pin.pico}번 핀
              </text>
            </g>
          );
        });
      })()}

      {/* ═══ Pico WH 실루엣 ═══ */}
      <rect x={picoX - 4} y={wireAreaTop} width="80" height={picoH} rx="5"
        fill="#0a2a1a" stroke="#00ff8844" strokeWidth="1.5" />
      <text x={picoX + 36} y={wireAreaTop + 13} fontSize="8" fill="#00ff88"
        textAnchor="middle" fontWeight="bold">Pico WH</text>
      <rect x={picoX + 14} y={wireAreaTop} width="24" height="5" rx="2"
        fill="#444" stroke="#666" strokeWidth="0.5" />

      {/* ═══ 범례 ═══ */}
      <g transform={`translate(15, ${legendY})`}>
        {/* 연결 포인트 */}
        <circle cx="6" cy="6" r="4.5" fill="#ff4444" stroke="#fff" strokeWidth="1.5" />
        <text x="16" y="9" fontSize="6.5" fill="#ddd" fontWeight="bold">= 연결 포인트 (여기에 꽂으세요)</text>
        {/* 선 색 범례 */}
        {pins.map((pin, i) => (
          <g key={`lg${i}`} transform={`translate(${i * (svgW / pins.length - 10)}, 18)`}>
            <line x1="0" y1="4" x2="14" y2="4" stroke={pin.wire} strokeWidth="3" strokeLinecap="round" />
            <text x="18" y="7" fontSize="6" fill="#aaa">{pin.label} ({pin.sensor}→{pin.picoName})</text>
          </g>
        ))}
        {needsPullup && (
          <g transform={`translate(0, 32)`}>
            <rect x="0" y="0" width="16" height="7" rx="3" fill="#d2b48c" stroke="#a08060" strokeWidth="0.5" />
            <text x="20" y="6" fontSize="6" fill="#ffaa44">= 4.7kΩ 풀업 저항</text>
          </g>
        )}
      </g>
    </svg>
  );
}

// ═══ 메인 컴포넌트 ═══
export default function WiringGuide() {
  const selectedSensor = useAppStore(s => s.selectedSensor);
  const shieldMode = useAppStore(s => s.shieldMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [showPinDetail, setShowPinDetail] = useState(false);
  const [groveChecked, setGroveChecked] = useState(false);

  const sensorBase = selectedSensor ? SENSORS[selectedSensor] : null;
  const modeData = sensorBase ? (shieldMode ? sensorBase.shield : sensorBase.direct) : null;

  if (!sensorBase || !modeData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', padding: 20, textAlign: 'center' }}>
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

        {/* ★ 준비물 체크리스트 */}
        <PrepChecklist sensorBase={sensorBase} pins={pins} shieldMode={true}
          isI2C={isI2C} needsPullup={false} grovePort={modeData.grovePort} />

        {/* 메인: Grove 포트 연결 1단계 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setGroveChecked(!groveChecked)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGroveChecked(!groveChecked); } }}
          style={{
            background: groveChecked ? '#0a2a0a' : '#0a1a2e',
            border: `2px solid ${groveChecked ? '#00ff88' : modeData.grovePort.color}66`,
            borderRadius: 12, padding: 20, cursor: 'pointer',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.04 }}>🛡️</div>
          <div style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 12,
            background: groveChecked ? '#00ff8822' : modeData.grovePort.color + '22',
            color: groveChecked ? '#00ff88' : modeData.grovePort.color,
            fontSize: 10, fontWeight: 'bold', marginBottom: 12,
          }}>
            {groveChecked ? '✓ 완료' : 'STEP 1 — 이것만 하면 끝!'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
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

        {/* Grove 장점 */}
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
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>USB 케이블로 Pico를 컴퓨터에 연결하세요</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>코드 탭으로 이동해서 코드를 실행해보세요 →</div>
          </div>
        )}

        {/* 핀 매핑 (접이식) */}
        <div>
          <button
            onClick={() => setShowPinDetail(!showPinDetail)}
            style={{
              background: 'transparent', border: '1px solid #1a1a2e', borderRadius: 6,
              padding: '6px 12px', color: '#888', fontSize: 10, cursor: 'pointer', width: '100%',
            }}>
            {showPinDetail ? '▼' : '▶'} 실제 핀 매핑 보기 (고급)
          </button>
          {showPinDetail && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#0a0a14', borderRadius: 8, border: '1px solid #1a1a2e' }}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 6 }}>Grove 케이블 내부 배선 (자동 연결됨)</div>
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
        <span style={{ fontSize: 11, color: '#888', marginLeft: 'auto' }}>
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

      {/* ★ 준비물 체크리스트 */}
      <PrepChecklist sensorBase={sensorBase} pins={pins} shieldMode={false}
        isI2C={isI2C} needsPullup={needsPullup} />

      {/* ★ 통합 브레드보드 배선도 (센서 + 저항 + Pico 한눈에) */}
      <div style={{
        background: '#0d0d1a', borderRadius: 10, padding: 12,
        border: '1px solid #1a1a3a',
      }}>
        <div style={{ color: '#aaa', marginBottom: 8, fontSize: 10, fontWeight: 'bold' }}>
          {needsPullup
            ? '🔧 전체 배선도 — 센서 + 풀업 저항 + Pico (한눈에 보기)'
            : '🔧 브레드보드 배선도 (위에서 내려다본 모습)'}
        </div>
        <UnifiedBreadboardSVG pins={pins} sensorBase={sensorBase} needsPullup={needsPullup} />
      </div>

      {/* 풀업 저항 팁 */}
      {needsPullup && (
        <div style={{
          padding: '8px 12px', borderRadius: 6,
          background: '#0a1a2e', border: '1px solid #0066ff22',
          fontSize: 10, color: '#88aadd',
        }}>
          💡 풀업 저항은 I2C 통신 신호를 안정시켜요. 없으면 센서와 Pico가 대화를 못해요!
          <br />💡 Grove Shield를 쓰면 이 저항이 내장되어 있어서 필요 없어요.
        </div>
      )}

      {/* 단계별 배선 체크리스트 */}
      <div style={{ fontSize: 11, color: '#888' }}>📌 점퍼선 연결 (클릭하여 체크)</div>
      {pins.map((pin, i) => {
        const checked = checkedSteps.includes(i);
        const isCurrent = i === currentStep;
        const termExplain = getTermExplain(pin.sensor);

        return (
          <div key={i}
            role="button"
            tabIndex={0}
            onClick={() => { setCurrentStep(i); toggleCheck(i); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentStep(i); toggleCheck(i); } }}
            style={{
              background: checked ? '#0a2a0a' : isCurrent ? '#0d1a2e' : '#0d0d1a',
              border: `1px solid ${checked ? '#00ff8844' : isCurrent ? sensorBase.color + '66' : '#1a1a2e'}`,
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: checked ? 0.7 : 1,
            }}>
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
                  <span style={{ color: '#888' }}>·</span>
                  <span style={{ fontFamily: 'monospace', color: '#aaa', fontSize: 11 }}>센서 {pin.sensor}</span>
                  <span style={{ color: '#00ff88' }}>→</span>
                  <span style={{
                    fontFamily: 'monospace', color: pin.wire,
                    fontWeight: 'bold', fontSize: 11,
                  }}>{pin.picoName}</span>
                  <span style={{ color: '#888', fontSize: 9 }}>({pin.pico}번)</span>
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
          <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
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
