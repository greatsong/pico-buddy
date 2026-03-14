import { useMemo } from 'react';
import useAppStore from '../../stores/appStore';
import SENSORS from '../../data/sensors';
import { PICO_LEFT, PICO_RIGHT, PIN_COLORS } from '../../data/pins';
import GLOSSARY from '../../data/glossary';

// SVG Pico 2 WH 보드 — 실제 보드처럼 생긴 시각적 핀맵
export default function PicoBoard() {
  const selectedSensor = useAppStore(s => s.selectedSensor);
  const shieldMode = useAppStore(s => s.shieldMode);
  const highlightPins = useAppStore(s => s.highlightPins);

  const sensorBase = selectedSensor ? SENSORS[selectedSensor] : null;
  const modeData = sensorBase ? (shieldMode ? sensorBase.shield : sensorBase.direct) : null;
  const activePins = modeData ? modeData.pins.map(p => p.pico) : [];

  const getWireColor = (pinNum) => modeData?.pins.find(p => p.pico === pinNum)?.wire;
  const getWireLabel = (pinNum) => modeData?.pins.find(p => p.pico === pinNum)?.sensor;

  const boardWidth = 520;
  const boardHeight = 620;
  const pcbX = 160;
  const pcbW = 200;
  const pinStartY = 60;
  const pinGap = 26;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 8px', overflow: 'auto' }}>
      {/* 센서 정보 배너 */}
      {sensorBase && (
        <div style={{
          marginBottom: 10, padding: '8px 16px', borderRadius: 10,
          background: `${sensorBase.color}15`, border: `1px solid ${sensorBase.color}40`,
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 500,
        }}>
          <span style={{ fontSize: 20 }}>{sensorBase.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: sensorBase.color }}>
              {sensorBase.name} — {sensorBase.label}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              {sensorBase.protocol}{sensorBase.address ? ` · ${sensorBase.address}` : ''} · {shieldMode ? 'Grove Shield' : '직접연결'}
            </div>
          </div>
        </div>
      )}

      <svg width={boardWidth} height={boardHeight} viewBox={`0 0 ${boardWidth} ${boardHeight}`}
        style={{ maxWidth: '100%', height: 'auto' }}>
        {/* PCB 보드 */}
        <rect x={pcbX} y={20} width={pcbW} height={boardHeight - 40} rx={12}
          fill="url(#pcbGradient)" stroke="#2d5a2d" strokeWidth={2} />

        {/* 그래디언트 */}
        <defs>
          <linearGradient id="pcbGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a4a1a" />
            <stop offset="100%" stopColor="#0d2d0d" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* USB-C 포트 */}
        <rect x={pcbX + 70} y={14} width={60} height={18} rx={4}
          fill="#333" stroke="#555" strokeWidth={1} />
        <text x={pcbX + 100} y={27} textAnchor="middle" fontSize={8} fill="#888">USB-C</text>

        {/* RP2350 칩 */}
        <rect x={pcbX + 60} y={260} width={80} height={60} rx={4}
          fill="#111" stroke="#333" strokeWidth={1} />
        <text x={pcbX + 100} y={288} textAnchor="middle" fontSize={9} fill="#335533">RP2350</text>
        <text x={pcbX + 100} y={300} textAnchor="middle" fontSize={7} fill="#224422">Pico 2 WH</text>

        {/* BOOTSEL 버튼 */}
        <circle cx={pcbX + 100} cy={230} r={8} fill="#222" stroke="#444" strokeWidth={1} />
        <text x={pcbX + 100} y={248} textAnchor="middle" fontSize={6} fill="#555">BOOTSEL</text>

        {/* LED */}
        <circle cx={pcbX + 40} cy={80} r={3} fill="#00ff00" opacity={0.6} />

        {/* 왼쪽 핀 (1~20) */}
        {PICO_LEFT.map((pin, i) => {
          const y = pinStartY + i * pinGap;
          const isActive = activePins.includes(pin.p);
          const wireColor = getWireColor(pin.p);
          const wireLabel = getWireLabel(pin.p);
          const isHighlighted = highlightPins.includes(pin.p);
          const pinColor = isActive ? wireColor : PIN_COLORS[pin.type];

          return (
            <g key={`left-${pin.p}`}>
              {/* 연결선 (활성 핀) */}
              {isActive && (
                <line x1={20} y1={y} x2={pcbX - 4} y2={y}
                  stroke={wireColor} strokeWidth={3} opacity={0.6}
                  strokeDasharray={isHighlighted ? "none" : "6,3"}>
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
                </line>
              )}

              {/* 핀 원 */}
              <circle cx={pcbX} cy={y} r={8}
                fill={isActive ? wireColor : "#1a1a1a"}
                stroke={pinColor} strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? "url(#glow)" : "none"}
                style={{ cursor: 'pointer' }}>
                {isActive && (
                  <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
                )}
              </circle>
              <text x={pcbX} y={y + 3.5} textAnchor="middle" fontSize={7} fill="#000" fontWeight="bold">
                {pin.p}
              </text>

              {/* 핀 이름 */}
              <text x={pcbX - 16} y={y + 4} textAnchor="end" fontSize={9}
                fill={isActive ? wireColor : '#888'} fontWeight={isActive ? 'bold' : 'normal'}
                fontFamily="monospace">
                {pin.n}
              </text>

              {/* 센서 핀 라벨 */}
              {isActive && wireLabel && (
                <g>
                  <rect x={2} y={y - 9} width={50} height={18} rx={4}
                    fill={wireColor + '22'} stroke={wireColor} strokeWidth={1} />
                  <text x={27} y={y + 4} textAnchor="middle" fontSize={8}
                    fill={wireColor} fontWeight="bold">{wireLabel}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* 오른쪽 핀 (40~21) */}
        {PICO_RIGHT.map((pin, i) => {
          const y = pinStartY + i * pinGap;
          const isActive = activePins.includes(pin.p);
          const wireColor = getWireColor(pin.p);
          const wireLabel = getWireLabel(pin.p);
          const isHighlighted = highlightPins.includes(pin.p);
          const pinColor = isActive ? wireColor : PIN_COLORS[pin.type];

          return (
            <g key={`right-${pin.p}`}>
              {/* 연결선 (활성 핀) */}
              {isActive && (
                <line x1={pcbX + pcbW + 4} y1={y} x2={boardWidth - 20} y2={y}
                  stroke={wireColor} strokeWidth={3} opacity={0.6}
                  strokeDasharray={isHighlighted ? "none" : "6,3"}>
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
                </line>
              )}

              {/* 핀 원 */}
              <circle cx={pcbX + pcbW} cy={y} r={8}
                fill={isActive ? wireColor : "#1a1a1a"}
                stroke={pinColor} strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? "url(#glow)" : "none"}
                style={{ cursor: 'pointer' }}>
                {isActive && (
                  <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
                )}
              </circle>
              <text x={pcbX + pcbW} y={y + 3.5} textAnchor="middle" fontSize={7} fill="#000" fontWeight="bold">
                {pin.p}
              </text>

              {/* 핀 이름 */}
              <text x={pcbX + pcbW + 16} y={y + 4} textAnchor="start" fontSize={9}
                fill={isActive ? wireColor : '#888'} fontWeight={isActive ? 'bold' : 'normal'}
                fontFamily="monospace">
                {pin.n}
              </text>

              {/* 센서 핀 라벨 */}
              {isActive && wireLabel && (
                <g>
                  <rect x={boardWidth - 58} y={y - 9} width={56} height={18} rx={4}
                    fill={wireColor + '22'} stroke={wireColor} strokeWidth={1} />
                  <text x={boardWidth - 30} y={y + 4} textAnchor="middle" fontSize={8}
                    fill={wireColor} fontWeight="bold">{wireLabel}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* 범례 */}
        <g transform={`translate(10, ${boardHeight - 70})`}>
          {[
            { color: PIN_COLORS.gpio, label: 'GPIO' },
            { color: PIN_COLORS.power, label: '전원' },
            { color: PIN_COLORS.ground, label: 'GND' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 60}, 0)`}>
              <circle cx={6} cy={6} r={4} fill={item.color} />
              <text x={14} y={10} fontSize={8} fill="#888">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* 배선 정보 요약 */}
      {modeData && (
        <div style={{
          width: '100%', maxWidth: 500, marginTop: 8,
          background: '#0d1a0d', border: '1px solid #1a2a1a',
          borderRadius: 10, padding: '10px 14px',
        }}>
          <div style={{ fontSize: 10, color: '#555', marginBottom: 6 }}>배선 요약</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {modeData.pins.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 4, background: p.wire, borderRadius: 2, boxShadow: `0 0 4px ${p.wire}` }} />
                <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>
                  {p.sensor}→{p.picoName}
                </span>
              </div>
            ))}
          </div>
          {modeData.warning && (
            <div style={{ marginTop: 6, fontSize: 10, color: '#ff8844', background: '#2a1a00', padding: '4px 8px', borderRadius: 4 }}>
              ⚠️ {modeData.warning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
