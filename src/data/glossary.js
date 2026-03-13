// 용어 사전 — 초보자가 처음 만나는 기술 용어를 쉽게 풀어서 설명
const GLOSSARY = {
  SDA: {
    term: "SDA",
    simple: "데이터 선",
    explain: "센서가 측정한 숫자를 Pico에게 보내는 전선이에요. 편지를 보내는 우체부 같은 역할!",
    emoji: "📨",
  },
  SCL: {
    term: "SCL",
    simple: "클록 선",
    explain: "SDA가 데이터를 보낼 타이밍을 맞춰주는 신호예요. 메트로놈처럼 박자를 맞춰줘요!",
    emoji: "🎵",
  },
  I2C: {
    term: "I2C",
    simple: "2선 통신",
    explain: "딱 2개의 선(SDA, SCL)만으로 여러 센서와 대화할 수 있는 방법이에요. 전화선 2개로 여러 사람과 통화하는 것처럼!",
    emoji: "🔗",
  },
  GPIO: {
    term: "GPIO",
    simple: "다목적 핀",
    explain: "켜고 끄기(LED), 눌림 감지(버튼) 등 여러 용도로 쓸 수 있는 핀이에요. 만능 소켓 같은 거예요!",
    emoji: "🔌",
  },
  VCC: {
    term: "VCC",
    simple: "전원(+)",
    explain: "센서에 전기를 공급하는 전선이에요. 빨간색 선으로 연결합니다. 콘센트의 (+)극 같은 역할!",
    emoji: "🔴",
  },
  GND: {
    term: "GND",
    simple: "접지(-)",
    explain: "전기가 돌아가는 길이에요. 검은색 선으로 연결합니다. 물이 배수구로 빠지는 것처럼, 전기도 GND로 돌아가야 해요!",
    emoji: "⚫",
  },
  "3.3V": {
    term: "3.3V",
    simple: "3.3볼트 전원",
    explain: "Pico가 센서에 공급하는 전압이에요. 대부분의 센서는 3.3V로 동작합니다. 5V를 쓰면 센서가 망가질 수 있어요!",
    emoji: "⚡",
  },
  Pin: {
    term: "Pin (핀)",
    simple: "연결 다리",
    explain: "Pico 양쪽에 나와있는 금색 다리예요. 총 40개가 있고, 각각 번호와 이름이 있어요. 여기에 전선을 꽂아서 센서를 연결해요!",
    emoji: "📌",
  },
  GP: {
    term: "GP 번호",
    simple: "핀 이름 번호",
    explain: "GP0, GP1, GP6처럼 핀의 이름이에요. 주의! GP6은 물리적 9번 핀이에요. GP번호 ≠ 핀 번호! 코드에서는 GP번호를 써야 해요.",
    emoji: "🏷️",
  },
  BOOTSEL: {
    term: "BOOTSEL",
    simple: "부트 버튼",
    explain: "Pico 위에 있는 작은 버튼이에요. 이걸 누른 상태로 USB를 꽂으면 펌웨어를 설치할 수 있어요!",
    emoji: "🔘",
  },
  MicroPython: {
    term: "MicroPython",
    simple: "마이크로파이썬",
    explain: "작은 컴퓨터(마이크로컨트롤러)에서 돌아가는 파이썬이에요. 일반 파이썬과 거의 같지만 더 가벼워요!",
    emoji: "🐍",
  },
  Thonny: {
    term: "Thonny",
    simple: "코드 편집기",
    explain: "Pico에 코드를 작성하고 보내는 프로그램이에요. 무료이고 초보자에게 가장 쉬운 도구예요!",
    emoji: "💻",
  },
  freq: {
    term: "freq (주파수)",
    simple: "통신 속도",
    explain: "I2C가 얼마나 빨리 데이터를 주고받을지 결정하는 값이에요. 너무 빠르면 센서가 못 따라갈 수 있어요!",
    emoji: "🏎️",
  },
  "풀업 저항": {
    term: "풀업 저항",
    simple: "신호 안정 부품",
    explain: "I2C 선의 신호를 안정시켜주는 작은 부품이에요. Grove Shield에는 이미 들어있지만, 직접 연결할 때는 별도로 달아야 해요!",
    emoji: "🔧",
  },
  "i2c.scan()": {
    term: "i2c.scan()",
    simple: "센서 찾기 명령",
    explain: "Pico에게 '연결된 센서가 있니?' 하고 물어보는 코드예요. [56]처럼 숫자가 나오면 센서를 찾은 거예요! []이면 센서를 못 찾은 거예요.",
    emoji: "🔍",
  },
};

// 텍스트에서 용어를 찾아서 하이라이트할 수 있도록
export const GLOSSARY_PATTERNS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

export default GLOSSARY;
