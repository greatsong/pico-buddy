// 주의사항 패널
const TIPS = [
  {
    category: "🔌 배선 기초", color: "#00ff88",
    items: [
      { level: "danger", title: "USB 연결 상태에서 배선하지 마세요",
        desc: "Pico에 USB가 꽂힌 상태에서 배선을 바꾸면 쇼트(합선)로 보드가 손상될 수 있습니다.",
        good: "항상 USB를 뽑은 뒤 배선하고, 다 연결한 후 USB를 꽂으세요." },
      { level: "danger", title: "VCC와 GND를 절대 바꾸지 마세요",
        desc: "빨간선(VCC)과 검은선(GND)을 반대로 꽂으면 센서가 즉시 고장납니다.",
        good: "빨강=전원(+), 검정=GND(-). 꽂기 전에 색상을 반드시 확인하세요." },
      { level: "warn", title: "3.3V와 5V를 구분하세요",
        desc: "Pico 2 WH의 센서는 대부분 3.3V용입니다. VBUS(5V)에 꽂으면 센서가 손상될 수 있어요.",
        good: "36번 핀(3.3V)에 연결하세요. 40번 핀(VBUS=5V)은 특별한 경우에만!" },
      { level: "info", title: "케이블이 헐겁게 꽂혀 있으면 안 됩니다",
        desc: "점퍼선이 핀에 제대로 안 꽂혀도 가끔 동작해요. 접촉 불량이 가장 흔한 원인!",
        good: "각 선을 살짝 잡아당겨서 빠지지 않는지 확인하세요." },
    ]
  },
  {
    category: "💻 코드 실수", color: "#00ccff",
    items: [
      { level: "danger", title: "GP 번호 ≠ 물리적 핀 번호!",
        desc: "코드에서 Pin(6)은 GP6번이지, 보드의 6번 핀이 아닙니다! GP6는 물리적 9번 핀이에요.",
        good: "항상 핀맵 탭을 확인하며 GP번호 기준으로 코드를 작성하세요." },
      { level: "danger", title: "I2C 버스 번호를 틀리면 오류!",
        desc: "GP6/GP7 → I2C(1, ...) / GP4/GP5 → I2C(0, ...) 이 규칙을 지켜야 해요.",
        good: "GP6/GP7 쓸 때는 I2C(1, sda=Pin(6), scl=Pin(7))로 쓰세요." },
      { level: "warn", title: "센서 초기화 대기 시간을 빠뜨리지 마세요",
        desc: "time.sleep(0.1) 없이 바로 읽으면 센서가 준비되지 않아 오류가 나요.",
        good: "I2C 설정 후 반드시 time.sleep(0.1) 이상 대기하세요." },
      { level: "info", title: "들여쓰기(indent) 오류에 주의",
        desc: "MicroPython은 들여쓰기가 틀리면 코드 자체가 실행되지 않아요.",
        good: "탭 대신 스페이스 4칸을 일관되게 사용하세요." },
    ]
  },
  {
    category: "🛡️ Grove Shield 사용 시", color: "#ff88ff",
    items: [
      { level: "warn", title: "쉴드를 꾹 눌러서 완전히 장착하세요",
        desc: "Shield가 Pico에 완전히 안 꽂히면 모든 센서가 인식되지 않아요.",
        good: "양손으로 꾹 눌러서 핀이 완전히 들어갔는지 확인하세요." },
      { level: "info", title: "I2C 포트가 2개입니다",
        desc: "I2C0(GP8/GP9)과 I2C1(GP6/GP7) 두 가지. 포트마다 코드가 달라요!",
        good: "I2C1 포트 → I2C(1, sda=Pin(6), scl=Pin(7))" },
    ]
  },
  {
    category: "🔍 문제 해결 순서", color: "#ffaa00",
    items: [
      { level: "info", title: "오류가 나면 이 순서로 확인하세요",
        desc: "① USB 재연결 → ② 배선 재확인 → ③ i2c.scan() 실행 → ④ 케이블 교체 → ⑤ 센서 교체",
        good: "i2c.scan()에서 [56] 같은 숫자 → 성공! [] → 배선 문제." },
      { level: "warn", title: "Thonny '연결 안됨' 상태일 때",
        desc: "USB를 뽑았다 꽂아도 안 되면, 다른 USB 포트나 케이블을 시도해보세요.",
        good: "충전 전용 케이블(데이터선 없음)은 Thonny에서 인식 안 돼요!" },
    ]
  },
];

export default function TipsPanel() {
  const levelStyles = {
    danger: { bg: '#2a0a0a', border: '#ff444466', badge: '#ff4444', badgeText: '🚨 위험' },
    warn: { bg: '#2a1a00', border: '#ffaa0066', badge: '#ffaa00', badgeText: '⚠️ 주의' },
    info: { bg: '#0a1a2a', border: '#4488ff66', badge: '#4488ff', badgeText: '💡 팁' },
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {TIPS.map((section, si) => (
        <div key={si}>
          <div style={{
            fontSize: 13, fontWeight: 'bold', color: section.color,
            marginBottom: 10, paddingBottom: 6,
            borderBottom: `1px solid ${section.color}33`,
          }}>
            {section.category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {section.items.map((item, ii) => {
              const style = levelStyles[item.level];
              return (
                <div key={ii} style={{
                  background: style.bg, border: `1px solid ${style.border}`,
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 10,
                      background: style.badge + '33', border: `1px solid ${style.badge}`,
                      color: style.badge,
                    }}>{style.badgeText}</span>
                    <span style={{ fontSize: 12, fontWeight: 'bold', color: '#ddd' }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#999', lineHeight: 1.6, marginBottom: item.good ? 8 : 0 }}>
                    {item.desc}
                  </div>
                  {item.good && (
                    <div style={{
                      fontSize: 11, color: '#00ff88', lineHeight: 1.6,
                      padding: '6px 10px', background: '#00ff8811',
                      borderRadius: 6, borderLeft: '3px solid #00ff88',
                    }}>
                      ✅ {item.good}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
