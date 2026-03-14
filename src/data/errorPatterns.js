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
    pattern: /(?:scan|i2c).*\[\s*\]|\[\s*\]\s*$/im,
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
  {
    pattern: /AttributeError/i,
    cause: "속성/메서드 오류 — 잘못된 메서드 이름",
    emoji: "🔤",
    explain: "해당 객체에 존재하지 않는 메서드나 속성을 사용했어요. 메서드 이름을 잘못 쓴 경우가 많아요!",
    solutions: [
      "메서드 이름 철자를 확인하세요 (예: writeto → writeto, readfrom → readfrom)",
      "MicroPython과 일반 Python은 메서드 이름이 다를 수 있어요",
      "dir(객체)를 실행하면 사용 가능한 메서드 목록을 볼 수 있어요",
      "예: i2c.write() ← X, i2c.writeto() ← O",
    ],
    tab: "code",
  },
  {
    pattern: /TypeError/i,
    cause: "타입 오류 — 잘못된 인자 타입",
    emoji: "🔄",
    explain: "함수에 전달한 값의 종류(타입)가 맞지 않아요. 숫자를 넣어야 하는데 문자를 넣었거나 그 반대예요!",
    solutions: [
      "함수에 넣는 값의 타입을 확인하세요 (숫자? 문자열? 바이트?)",
      "Pin(6)처럼 숫자를 넣어야 하는데 Pin('6')처럼 문자열을 넣지 않았나요?",
      "bytes([0xAC])처럼 바이트 배열이 필요한 곳에 일반 리스트를 넣지 않았나요?",
      "int()로 숫자 변환: int('123') → 123",
    ],
    tab: "code",
  },
  {
    pattern: /ValueError/i,
    cause: "값 오류 — 유효하지 않은 값",
    emoji: "🚫",
    explain: "함수에 넣은 값이 허용 범위를 벗어났어요. 예를 들어 존재하지 않는 핀 번호를 쓴 거예요!",
    solutions: [
      "핀 번호가 Pico W에 존재하는 번호인지 확인하세요 (GP0~GP28)",
      "ADC는 GP26, GP27, GP28만 사용 가능해요",
      "I2C 주소는 0x00~0x7F 범위여야 해요",
      "PWM 주파수나 듀티 값이 허용 범위인지 확인하세요",
    ],
    tab: "code",
  },
  {
    pattern: /RuntimeError/i,
    cause: "런타임 오류 — 장치가 사용 중",
    emoji: "🔒",
    explain: "프로그램 실행 중에 오류가 발생했어요. 장치가 이미 사용 중이거나 상태가 올바르지 않아요.",
    solutions: [
      "이전 프로그램이 아직 실행 중인지 확인하세요 (Thonny에서 Stop 버튼 클릭)",
      "USB를 뽑았다 다시 꽂아서 Pico를 리셋해보세요",
      "Thonny 하단의 Shell에서 Ctrl+C를 눌러 실행 중인 코드를 멈추세요",
      "같은 핀/버스를 두 번 설정하지 않았는지 확인하세요",
    ],
    tab: "code",
  },
  {
    pattern: /KeyboardInterrupt/i,
    cause: "사용자가 프로그램을 중단함 (Ctrl+C)",
    emoji: "⛔",
    explain: "프로그램이 실행 중에 Ctrl+C를 눌러서 멈춘 거예요. 이건 에러가 아니라 정상적인 중단이에요!",
    solutions: [
      "이건 오류가 아니에요! Ctrl+C로 while True 루프를 멈출 수 있어요",
      "프로그램을 다시 실행하려면 Thonny에서 Run 버튼을 누르세요",
      "try/except KeyboardInterrupt로 깔끔하게 종료 처리할 수 있어요",
    ],
    tab: "code",
  },
  {
    pattern: /MemoryError|ENOMEM/i,
    cause: "메모리 부족",
    emoji: "💾",
    explain: "Pico의 메모리가 가득 찼어요! Pico는 RAM이 264KB밖에 없어서 큰 데이터를 저장하면 부족해질 수 있어요.",
    solutions: [
      "리스트에 너무 많은 데이터를 저장하고 있지 않은지 확인하세요",
      "큰 문자열이나 배열을 만들지 않았는지 확인",
      "gc.collect()를 호출해서 사용하지 않는 메모리를 정리해보세요",
      "import gc; gc.collect(); print(gc.mem_free()) 로 남은 메모리 확인",
      "I2C 버퍼가 너무 크면 작은 단위로 나눠서 읽으세요",
    ],
    tab: "code",
  },
  {
    pattern: /No module named/i,
    cause: "라이브러리가 설치되지 않음",
    emoji: "📥",
    explain: "사용하려는 라이브러리(모듈)가 Pico에 없어요. MicroPython에는 일반 Python 라이브러리를 설치할 수 없어요!",
    solutions: [
      "MicroPython 내장 모듈만 사용 가능해요: machine, time, struct, json 등",
      "ssd1306 같은 외부 라이브러리는 Thonny의 '패키지 관리'에서 설치하세요",
      "Thonny → 도구 → 패키지 관리 → 'micropython-ssd1306' 검색 → 설치",
      "pip install은 MicroPython에서 사용할 수 없어요!",
    ],
    tab: "code",
  },
  {
    pattern: /Invalid I2C address|invalid addr/i,
    cause: "잘못된 I2C 주소",
    emoji: "📮",
    explain: "센서의 I2C 주소가 올바르지 않아요. 각 센서마다 고유한 주소가 있어요!",
    solutions: [
      "i2c.scan()으로 실제 연결된 센서 주소를 확인하세요",
      "주요 센서 주소: DHT20=0x38, SCD41=0x62, BMP280=0x76, OLED=0x3C",
      "주소 앞에 0x를 붙여야 16진수예요 (예: 0x38, 0x62)",
      "센서 데이터시트에서 정확한 주소를 확인하세요",
    ],
    tab: "code",
  },
  {
    pattern: /already in use|pin.*conflict/i,
    cause: "핀 충돌 — 같은 핀을 두 번 사용",
    emoji: "⚡",
    explain: "같은 GPIO 핀을 두 곳에서 동시에 사용하려고 해요. 한 핀은 한 번에 하나의 용도로만 쓸 수 있어요!",
    solutions: [
      "같은 핀 번호를 두 번 설정하지 않았는지 확인하세요",
      "LED와 서보를 같은 핀(예: GP16)에 동시에 연결하면 안 돼요",
      "사용 중인 핀 목록을 정리해보세요",
      "필요하면 다른 GP 번호를 사용하세요",
    ],
    tab: "wiring",
  },
  {
    pattern: /Traceback.*most recent call/i,
    cause: "파이썬 오류 추적 정보",
    emoji: "🔎",
    explain: "프로그램에서 오류가 발생했어요! Traceback은 오류가 어디서 발생했는지 알려주는 정보예요.",
    solutions: [
      "Traceback의 마지막 줄이 실제 에러 내용이에요 — 그 부분을 먼저 읽으세요",
      "File '...' line X ← 이 부분이 에러가 발생한 코드 위치예요",
      "에러 메시지를 복사해서 AI 튜터에게 물어보세요",
      "코드의 해당 줄을 확인하고 오타나 문법 오류가 없는지 살펴보세요",
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
