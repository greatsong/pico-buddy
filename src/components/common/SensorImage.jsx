// 센서/부품 SVG 일러스트레이션 — 이모지 폴백 지원
// 데이터 완비된 센서들은 인라인 SVG, 나머지는 이모지

const SENSOR_SVGS = {
  LED: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* LED 본체 */}
      <ellipse cx="32" cy="28" rx="14" ry="16" fill="#ff4444" opacity="0.9" />
      <ellipse cx="32" cy="28" rx="14" ry="16" fill="url(#ledGlow)" />
      {/* 빛 반사 */}
      <ellipse cx="28" cy="22" rx="5" ry="7" fill="#fff" opacity="0.3" />
      {/* 다리 */}
      <rect x="27" y="42" width="3" height="14" rx="1" fill="#ccc" />
      <rect x="34" y="42" width="3" height="14" rx="1" fill="#ccc" />
      {/* + - 표시 */}
      <text x="27" y="60" fontSize="6" fill="#999" textAnchor="middle">+</text>
      <text x="37" y="60" fontSize="6" fill="#999" textAnchor="middle">-</text>
      {/* 빛 효과 */}
      <line x1="14" y1="18" x2="8" y2="12" stroke="#ff444466" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="18" x2="56" y2="12" stroke="#ff444466" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="8" x2="32" y2="2" stroke="#ff444466" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <radialGradient id="ledGlow" cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),

  BUTTON: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 버튼 베이스 */}
      <rect x="12" y="24" width="40" height="24" rx="4" fill="#333" stroke="#555" strokeWidth="1.5" />
      {/* 버튼 캡 */}
      <rect x="20" y="28" width="24" height="12" rx="6" fill="#ff8844" />
      <rect x="20" y="28" width="24" height="6" rx="4" fill="#ffaa66" opacity="0.5" />
      {/* 핀 */}
      <rect x="18" y="48" width="2" height="10" rx="1" fill="#ccc" />
      <rect x="26" y="48" width="2" height="10" rx="1" fill="#ccc" />
      <rect x="36" y="48" width="2" height="10" rx="1" fill="#ccc" />
      <rect x="44" y="48" width="2" height="10" rx="1" fill="#ccc" />
      {/* 라벨 */}
      <text x="32" y="20" fontSize="7" fill="#888" textAnchor="middle" fontFamily="monospace">PUSH</text>
    </svg>
  ),

  DHT20: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 센서 몸체 */}
      <rect x="14" y="10" width="36" height="36" rx="4" fill="#1a6644" stroke="#2a8855" strokeWidth="1" />
      {/* 센서 그리드 */}
      <rect x="22" y="16" width="20" height="20" rx="2" fill="#0d3322" />
      {/* 격자 패턴 (환기구) */}
      {[0,1,2,3].map(i => (
        <line key={`h${i}`} x1="24" y1={20+i*4} x2="40" y2={20+i*4} stroke="#1a5533" strokeWidth="1" />
      ))}
      {[0,1,2,3].map(i => (
        <line key={`v${i}`} x1={28+i*4} y1="18" x2={28+i*4} y2="34" stroke="#1a5533" strokeWidth="1" />
      ))}
      {/* 핀 */}
      <rect x="20" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="28" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="34" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="42" y="46" width="2" height="10" rx="1" fill="#dda000" />
      {/* 온습도 아이콘 */}
      <text x="32" y="44" fontSize="7" fill="#44cc77" textAnchor="middle" fontFamily="monospace">T/H</text>
    </svg>
  ),

  SCD30: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 센서 PCB */}
      <rect x="10" y="12" width="44" height="34" rx="3" fill="#1a4433" stroke="#2a6644" strokeWidth="1" />
      {/* 센서 모듈 (검은 박스) */}
      <rect x="18" y="16" width="28" height="22" rx="2" fill="#111" stroke="#333" strokeWidth="1" />
      {/* 센서 구멍 (가스 유입구) */}
      <circle cx="32" cy="27" r="6" fill="#222" stroke="#444" strokeWidth="1" />
      <circle cx="32" cy="27" r="3" fill="#333" />
      <circle cx="32" cy="27" r="1" fill="#555" />
      {/* CO2 텍스트 */}
      <text x="32" y="44" fontSize="7" fill="#44bb66" textAnchor="middle" fontFamily="monospace">CO2</text>
      {/* 핀 */}
      <rect x="18" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="26" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="34" y="46" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="42" y="46" width="2" height="10" rx="1" fill="#dda000" />
    </svg>
  ),

  BMP280: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* PCB */}
      <rect x="14" y="14" width="36" height="30" rx="3" fill="#2a1144" stroke="#442266" strokeWidth="1" />
      {/* 센서 칩 */}
      <rect x="22" y="18" width="20" height="14" rx="1.5" fill="#111" stroke="#333" strokeWidth="1" />
      {/* 칩 마킹 */}
      <circle cx="26" cy="22" r="1.5" fill="#442266" />
      <text x="32" y="29" fontSize="5" fill="#666" textAnchor="middle" fontFamily="monospace">BMP</text>
      {/* 기압 아이콘 */}
      <text x="32" y="42" fontSize="7" fill="#9966cc" textAnchor="middle" fontFamily="monospace">hPa</text>
      {/* 핀 */}
      <rect x="20" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="28" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="34" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="42" y="44" width="2" height="10" rx="1" fill="#dda000" />
    </svg>
  ),

  LIGHT: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* PCB */}
      <rect x="14" y="16" width="36" height="28" rx="3" fill="#1a3344" stroke="#2a5566" strokeWidth="1" />
      {/* 포토셀 (CdS) */}
      <circle cx="32" cy="28" r="10" fill="#443322" stroke="#665544" strokeWidth="1.5" />
      {/* CdS 패턴 */}
      <path d="M26 28 C28 24, 32 24, 32 28 C32 32, 36 32, 38 28" stroke="#887744" strokeWidth="1.5" fill="none" />
      {/* 빛 표시 */}
      <line x1="32" y1="8" x2="32" y2="14" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="12" x2="24" y2="17" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="12" x2="40" y2="17" stroke="#ffdd00" strokeWidth="1.5" strokeLinecap="round" />
      {/* 핀 */}
      <rect x="22" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="30" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="38" y="44" width="2" height="10" rx="1" fill="#dda000" />
    </svg>
  ),

  SOUND: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* PCB */}
      <rect x="14" y="14" width="36" height="30" rx="3" fill="#331a1a" stroke="#552a2a" strokeWidth="1" />
      {/* 마이크 */}
      <circle cx="32" cy="26" r="9" fill="#222" stroke="#444" strokeWidth="1.5" />
      <circle cx="32" cy="26" r="3" fill="#333" />
      {/* 음파 표시 */}
      <path d="M44 20 Q48 26, 44 32" stroke="#ff664466" strokeWidth="1.5" fill="none" />
      <path d="M48 17 Q54 26, 48 35" stroke="#ff664433" strokeWidth="1.5" fill="none" />
      {/* 라벨 */}
      <text x="32" y="42" fontSize="7" fill="#ff6644" textAnchor="middle" fontFamily="monospace">MIC</text>
      {/* 핀 */}
      <rect x="22" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="30" y="44" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="38" y="44" width="2" height="10" rx="1" fill="#dda000" />
    </svg>
  ),

  ULTRASONIC: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* PCB */}
      <rect x="8" y="18" width="48" height="24" rx="3" fill="#1a2244" stroke="#2a3366" strokeWidth="1" />
      {/* 초음파 송수신기 2개 */}
      <circle cx="22" cy="30" r="8" fill="#ddd" stroke="#aaa" strokeWidth="1" />
      <circle cx="22" cy="30" r="5" fill="#bbb" />
      <circle cx="22" cy="30" r="2" fill="#999" />
      <circle cx="42" cy="30" r="8" fill="#ddd" stroke="#aaa" strokeWidth="1" />
      <circle cx="42" cy="30" r="5" fill="#bbb" />
      <circle cx="42" cy="30" r="2" fill="#999" />
      {/* 초음파 표시 */}
      <path d="M8 24 Q2 30, 8 36" stroke="#00ccff44" strokeWidth="1.5" fill="none" />
      <path d="M56 24 Q62 30, 56 36" stroke="#00ccff44" strokeWidth="1.5" fill="none" />
      {/* 핀 */}
      <rect x="22" y="42" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="30" y="42" width="2" height="10" rx="1" fill="#dda000" />
      <rect x="38" y="42" width="2" height="10" rx="1" fill="#dda000" />
    </svg>
  ),

  SERVO: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 모터 본체 */}
      <rect x="12" y="16" width="40" height="28" rx="3" fill="#2266cc" stroke="#3377dd" strokeWidth="1" />
      {/* 기어 하우징 */}
      <circle cx="42" cy="16" r="6" fill="#3377dd" stroke="#4488ee" strokeWidth="1" />
      {/* 기어 중심 */}
      <circle cx="42" cy="16" r="3" fill="#ddd" />
      <circle cx="42" cy="16" r="1.5" fill="#888" />
      {/* 혼 (팔) */}
      <rect x="40" y="6" width="4" height="10" rx="2" fill="#ddd" stroke="#aaa" strokeWidth="0.5" />
      {/* 라벨 */}
      <text x="28" y="34" fontSize="6" fill="#aaccff" textAnchor="middle" fontFamily="monospace">SERVO</text>
      {/* 선 3개 */}
      <rect x="18" y="44" width="3" height="12" rx="1" fill="#ff4444" />
      <rect x="26" y="44" width="3" height="12" rx="1" fill="#444" />
      <rect x="34" y="44" width="3" height="12" rx="1" fill="#ffaa00" />
      {/* 선 라벨 */}
      <text x="19" y="62" fontSize="4" fill="#ff4444" textAnchor="middle">V</text>
      <text x="27" y="62" fontSize="4" fill="#888" textAnchor="middle">G</text>
      <text x="35" y="62" fontSize="4" fill="#ffaa00" textAnchor="middle">S</text>
    </svg>
  ),

  OLED: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* PCB */}
      <rect x="10" y="10" width="44" height="38" rx="3" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1" />
      {/* OLED 화면 */}
      <rect x="14" y="14" width="36" height="22" rx="2" fill="#000" stroke="#333" strokeWidth="1" />
      {/* 화면 표시 내용 */}
      <text x="18" y="23" fontSize="5" fill="#00ffcc" fontFamily="monospace">Hello!</text>
      <text x="18" y="31" fontSize="5" fill="#00ffcc" fontFamily="monospace">Pico ♡</text>
      {/* 핀 */}
      <rect x="20" y="48" width="2" height="8" rx="1" fill="#dda000" />
      <rect x="28" y="48" width="2" height="8" rx="1" fill="#dda000" />
      <rect x="34" y="48" width="2" height="8" rx="1" fill="#dda000" />
      <rect x="40" y="48" width="2" height="8" rx="1" fill="#dda000" />
      {/* 핀 라벨 */}
      <text x="32" y="46" fontSize="5" fill="#6688ee" textAnchor="middle" fontFamily="monospace">SSD1306</text>
    </svg>
  ),

  BUZZER: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 부저 몸체 (원통) */}
      <circle cx="32" cy="28" r="16" fill="#222" stroke="#444" strokeWidth="1.5" />
      <circle cx="32" cy="28" r="12" fill="#333" />
      <circle cx="32" cy="28" r="4" fill="#444" />
      {/* 상단 구멍 */}
      <circle cx="32" cy="28" r="1.5" fill="#555" />
      {/* + 표시 */}
      <text x="18" y="18" fontSize="8" fill="#ff4444" fontWeight="bold">+</text>
      {/* 소리 표시 */}
      <path d="M50 22 Q54 28, 50 34" stroke="#5577dd44" strokeWidth="1.5" fill="none" />
      <path d="M54 19 Q60 28, 54 37" stroke="#5577dd33" strokeWidth="1.5" fill="none" />
      {/* 핀 */}
      <rect x="28" y="44" width="2" height="12" rx="1" fill="#ccc" />
      <rect x="34" y="44" width="2" height="12" rx="1" fill="#ccc" />
    </svg>
  ),
};

export default function SensorImage({ sensorId, size = 48, className = '' }) {
  const SvgComponent = SENSOR_SVGS[sensorId];

  if (SvgComponent) {
    return (
      <div
        className={`sensor-image ${className}`}
        style={{
          width: size, height: size,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        role="img"
        aria-label={`${sensorId} 부품 그림`}
      >
        <SvgComponent size={size} />
      </div>
    );
  }

  // 이모지 폴백
  return null;
}

// 해당 센서에 SVG가 있는지 확인
export function hasSensorImage(sensorId) {
  return sensorId in SENSOR_SVGS;
}
