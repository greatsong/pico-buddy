// 에러 메시지 자동 진단 패턴
const ERROR_PATTERNS = [
  {
    pattern: /ETIMEDOUT/i,
    cause: "I2C 통신 시간 초과",
    emoji: "⏰",
    explain: "센서와 Pico가 대화를 시도했지만 응답이 없었어요. 전화를 걸었는데 상대방이 안 받는 것과 같아요!",
    solutions: [
      "모든 배선이 빠지지 않았는지 꾹 눌러서 확인하세요",
      "SDA(노랑)와 SCL(흰색) 선이 바뀌지 않았는지 확인하세요",
      "코드에서 freq=50000으로 낮춰보세요 (속도를 늦추면 안정적)",
      "다른 Grove 케이블로 교체해보세요",
    ],
    tab: "wiring",
  },
  {
    pattern: /bad SCL pin|bad SDA pin/i,
    cause: "핀 번호와 I2C 버스 불일치",
    emoji: "🔢",
    explain: "GP6/GP7은 I2C '1번' 버스예요. I2C(0,...)이 아니라 I2C(1,...)을 써야 해요! 버스 번호가 안 맞으면 이 오류가 나요.",
    solutions: [
      "GP6/GP7 사용 시: I2C(1, sda=Pin(6), scl=Pin(7))",
      "GP4/GP5 사용 시: I2C(0, sda=Pin(4), scl=Pin(5))",
      "숫자 1과 0을 바꿔보세요!",
    ],
    tab: "code",
  },
  {
    pattern: /\[\s*\]/,
    cause: "센서 미인식 (빈 스캔 결과)",
    emoji: "🔍",
    explain: "i2c.scan()을 했는데 아무것도 안 나왔어요. 센서가 Pico에 연결되지 않았다는 뜻이에요!",
    solutions: [
      "배선을 처음부터 다시 확인하세요",
      "VCC(빨강)가 3.3V에, GND(검정)가 GND에 꽂혀있는지 확인",
      "Grove 케이블이 딸깍 소리 나도록 완전히 꽂혀있는지 확인",
      "USB를 뽑았다 다시 꽂아보세요",
      "다른 센서나 케이블로 교체해서 테스트",
    ],
    tab: "wiring",
  },
  {
    pattern: /OSError.*\[?Errno\s*5\]?/i,
    cause: "I2C 입출력 오류",
    emoji: "❌",
    explain: "센서와 통신 중 오류가 발생했어요. 배선이 불안정하거나 센서가 제대로 응답하지 않아요.",
    solutions: [
      "모든 배선 연결이 튼튼한지 확인하세요",
      "센서에 전원(3.3V)이 제대로 공급되고 있는지 확인",
      "time.sleep(0.1)을 더 길게 (time.sleep(0.5)) 해보세요",
    ],
    tab: "wiring",
  },
  {
    pattern: /ImportError|ModuleNotFoundError/i,
    cause: "모듈을 찾을 수 없음",
    emoji: "📦",
    explain: "필요한 라이브러리가 없어요. MicroPython에 내장된 모듈만 사용할 수 있어요!",
    solutions: [
      "MicroPython 펌웨어가 제대로 설치되었는지 확인하세요",
      "machine, time, struct 등은 MicroPython 내장 모듈이에요",
      "pip install은 MicroPython에서 사용할 수 없어요!",
    ],
    tab: "code",
  },
  {
    pattern: /IndentationError|unexpected indent/i,
    cause: "들여쓰기 오류",
    emoji: "↔️",
    explain: "코드의 들여쓰기(앞쪽 공백)가 맞지 않아요. 파이썬은 들여쓰기가 매우 중요해요!",
    solutions: [
      "탭(Tab) 대신 스페이스 4칸을 사용하세요",
      "if, while, def 아래 줄은 반드시 들여쓰기 해야 해요",
      "Thonny에서 자동 들여쓰기를 사용하세요",
      "코드를 복사할 때 들여쓰기가 깨질 수 있어요 — 확인해보세요",
    ],
    tab: "code",
  },
  {
    pattern: /SyntaxError/i,
    cause: "문법 오류",
    emoji: "✏️",
    explain: "코드에 오타가 있거나 문법이 틀렸어요. 괄호나 콜론(:)을 빠뜨리진 않았나요?",
    solutions: [
      "if, while, def 끝에 콜론(:)이 있는지 확인",
      "괄호 ()가 열고 닫기 짝이 맞는지 확인",
      "따옴표 '' 또는 \"\"가 짝이 맞는지 확인",
      "print 뒤에 괄호가 있는지 확인: print('hello') ← O, print 'hello' ← X",
    ],
    tab: "code",
  },
  {
    pattern: /NameError/i,
    cause: "이름 오류 — 변수/함수를 찾을 수 없음",
    emoji: "🏷️",
    explain: "사용하려는 이름이 정의되지 않았어요. 오타이거나, 아직 만들지 않은 변수/함수예요.",
    solutions: [
      "변수 이름에 오타가 없는지 확인하세요 (대소문자 구분!)",
      "변수를 사용하기 전에 먼저 값을 넣었는지 확인",
      "함수를 호출하기 전에 def로 먼저 정의했는지 확인",
    ],
    tab: "code",
  },
];

// 에러 메시지에서 패턴 매칭
export function diagnoseError(errorText) {
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.pattern.test(errorText)) {
      return pattern;
    }
  }
  return null;
}

export default ERROR_PATTERNS;
