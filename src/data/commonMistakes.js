// 센서별 자주 하는 실수 — 선제적 경고
const COMMON_MISTAKES = {
  LED: [
    {
      level: "danger",
      title: "저항 없이 연결하면 LED가 즉시 고장!",
      desc: "직접 연결할 때 반드시 330Ω 저항을 LED 양극(+)에 직렬 연결하세요.",
      fix: "Grove Shield를 사용하면 저항이 내장되어 있어서 걱정 없어요!",
    },
    {
      level: "warn",
      title: "LED 방향이 중요해요!",
      desc: "LED에는 양극(+)과 음극(-)이 있어요. 긴 다리가 양극, 짧은 다리가 음극이에요.",
      fix: "Grove LED 모듈은 방향 상관없이 꽂으면 돼요.",
    },
  ],
  BUTTON: [
    {
      level: "warn",
      title: "버튼 값이 반대예요!",
      desc: "PULL_UP 설정에서는 버튼을 누르면 0, 안 누르면 1이에요. 직관과 반대!",
      fix: "if btn.value() == 0: 으로 '눌렸을 때'를 감지하세요.",
    },
    {
      level: "info",
      title: "바운싱 현상이 생길 수 있어요",
      desc: "버튼을 한 번 눌렀는데 여러 번 감지될 수 있어요. 기계적 떨림 때문이에요.",
      fix: "time.sleep(0.2)를 넣어서 감지 간격을 두세요.",
    },
  ],
  DHT20: [
    {
      level: "danger",
      title: "I2C 버스 번호를 확인하세요!",
      desc: "GP6/GP7은 I2C '1번' 버스예요. I2C(0,...)을 쓰면 'bad SCL pin' 에러가 나요!",
      fix: "코드: I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)",
    },
    {
      level: "warn",
      title: "센서 초기화 대기 시간 필수!",
      desc: "I2C 설정 직후 바로 읽으면 에러나요. 센서가 준비될 시간이 필요해요.",
      fix: "i2c 설정 후 time.sleep(0.1) 넣기",
    },
    {
      level: "warn",
      title: "직접 연결 시 풀업 저항 필요!",
      desc: "Grove Shield 없이 직접 연결하면 I2C 신호가 불안정해요.",
      fix: "4.7kΩ 풀업 저항을 SDA↔3.3V, SCL↔3.3V에 연결하거나, 코드에서 Pin(6, pull=Pin.PULL_UP) 사용",
    },
  ],
  SCD41: [
    {
      level: "warn",
      title: "첫 측정에 5초 이상 걸려요!",
      desc: "주기적 측정 시작 후 바로 읽으면 데이터가 없어요. 첫 측정까지 5초 대기.",
      fix: "i2c.writeto(...) 후 time.sleep(5) 넣기",
    },
    {
      level: "danger",
      title: "I2C 버스 번호를 확인하세요!",
      desc: "GP6/GP7은 I2C '1번' 버스예요. I2C(0,...)을 쓰면 에러가 나요!",
      fix: "코드: I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)",
    },
    {
      level: "info",
      title: "CO2 수치가 400 근처면 정상",
      desc: "실외 CO2 농도가 약 400ppm이에요. 교실은 보통 600~1500ppm.",
      fix: "1000ppm 이상이면 환기가 필요한 수준이에요!",
    },
  ],
  BMP280: [
    {
      level: "warn",
      title: "I2C 주소가 0x76 또는 0x77일 수 있어요!",
      desc: "BMP280은 SDO 핀에 따라 주소가 달라져요. 기본은 0x76.",
      fix: "i2c.scan()으로 실제 주소를 확인하세요!",
    },
    {
      level: "info",
      title: "표준 기압은 약 1013.25 hPa",
      desc: "해발 0m 기준 표준 기압이에요. 고도가 높을수록 기압이 낮아져요.",
      fix: "기압 차이로 대략적인 높이 차이를 계산할 수 있어요!",
    },
  ],
  LIGHT: [
    {
      level: "warn",
      title: "ADC 핀은 GP26, GP27, GP28만 사용 가능!",
      desc: "빛 센서는 아날로그(ADC) 센서라서 일반 디지털 핀에 꽂으면 값을 읽을 수 없어요.",
      fix: "반드시 GP26(A0), GP27(A2), GP28 중 하나에 연결하세요.",
    },
    {
      level: "info",
      title: "값이 0~65535 사이예요",
      desc: "read_u16()은 16비트 값을 돌려줘요. 0이 가장 어둡고, 65535가 가장 밝아요.",
      fix: "퍼센트로 변환: light_percent = light_value / 65535 * 100",
    },
    {
      level: "info",
      title: "빛 센서 값이 불안정하면 평균을 내세요",
      desc: "아날로그 센서는 값이 약간씩 흔들릴 수 있어요 (노이즈).",
      fix: "여러 번 읽어서 평균을 내면 안정적: sum([sensor.read_u16() for _ in range(10)]) / 10",
    },
  ],
  SOUND: [
    {
      level: "warn",
      title: "ADC 핀은 GP26, GP27, GP28만 사용 가능!",
      desc: "소리 센서도 아날로그 센서예요. 디지털 핀에 연결하면 동작하지 않아요.",
      fix: "Grove Shield A2 포트(GP27) 또는 GP26, GP28에 연결하세요.",
    },
    {
      level: "info",
      title: "소리는 순간적이에요!",
      desc: "소리는 매우 빠르게 변해요. time.sleep(1)처럼 간격이 길면 소리를 놓칠 수 있어요.",
      fix: "time.sleep(0.1) 이하로 짧게 설정하거나, 여러 번 읽어서 최대값을 사용하세요.",
    },
    {
      level: "info",
      title: "조용한 환경에서도 값이 0이 아니에요",
      desc: "센서 자체의 기본 노이즈가 있어서 완전 무음이라도 5000~10000 정도 나와요.",
      fix: "기준값(threshold)을 환경에 맞게 설정하세요. 처음에 조용할 때 값을 확인하고 기준을 정해요.",
    },
  ],
  ULTRASONIC: [
    {
      level: "danger",
      title: "TRIG와 ECHO 핀을 바꾸면 안 돼요!",
      desc: "TRIG는 출력(OUT), ECHO는 입력(IN)이에요. 바꿔 연결하면 측정이 안 돼요!",
      fix: "TRIG=GP16(OUT), ECHO=GP17(IN)으로 설정. Grove 케이블은 자동 연결돼요.",
    },
    {
      level: "warn",
      title: "2cm 미만은 측정할 수 없어요",
      desc: "초음파가 너무 빨리 돌아오면 측정이 불가능해요. 최소 거리는 약 2cm.",
      fix: "측정 범위: 2~400cm. 물체가 너무 가까이 있으면 잘못된 값이 나올 수 있어요.",
    },
    {
      level: "info",
      title: "부드러운 표면(천, 스펀지)은 잘 안 돼요",
      desc: "초음파는 딱딱하고 평평한 표면에서 잘 반사돼요. 부드러운 물체는 초음파를 흡수해요.",
      fix: "책, 벽, 상자 등 단단한 물체로 테스트하세요.",
    },
    {
      level: "warn",
      title: "타임아웃 처리를 꼭 하세요!",
      desc: "물체가 없으면 에코 신호가 안 돌아와서 프로그램이 멈출 수 있어요.",
      fix: "while 루프에 타임아웃(30ms)을 추가하세요. 예제 코드에 이미 포함되어 있어요!",
    },
  ],
  SERVO: [
    {
      level: "danger",
      title: "서보 모터 전원은 3.3V로 부족해요!",
      desc: "서보 모터는 전류를 많이 소모해요. 3.3V로는 힘이 부족하고, Pico가 불안정해질 수 있어요.",
      fix: "직접 연결 시 VBUS(5V)에 전원 연결. 여러 개 쓸 때는 외부 전원 필요.",
    },
    {
      level: "warn",
      title: "PWM 주파수는 반드시 50Hz!",
      desc: "서보 모터는 50Hz(20ms 주기) PWM 신호를 사용해요. 다른 주파수를 쓰면 제대로 안 돼요.",
      fix: "servo.freq(50) — 이 줄을 빠뜨리면 서보가 떨리거나 안 움직여요!",
    },
    {
      level: "info",
      title: "0도와 180도 끝에서 떨림이 있을 수 있어요",
      desc: "서보 모터의 물리적 한계 때문에 양 끝에서 떨림이 생길 수 있어요.",
      fix: "실제 사용 범위를 10~170도로 제한하면 안정적이에요.",
    },
    {
      level: "info",
      title: "서보 각도 변경 후 대기 시간 필요",
      desc: "서보가 목표 각도까지 이동하는 데 시간이 걸려요. 너무 빨리 바꾸면 따라가지 못해요.",
      fix: "set_angle() 호출 후 time.sleep(0.1~0.5)을 넣어서 이동 시간을 확보하세요.",
    },
  ],
  OLED: [
    {
      level: "danger",
      title: "ssd1306 라이브러리를 먼저 설치하세요!",
      desc: "OLED를 사용하려면 ssd1306 외부 라이브러리가 필요해요. 설치하지 않으면 ImportError!",
      fix: "Thonny → 도구 → 패키지 관리 → 'micropython-ssd1306' 검색 → 설치",
    },
    {
      level: "warn",
      title: "oled.show()를 꼭 호출하세요!",
      desc: "text()나 fill()만으로는 화면에 안 보여요. show()를 호출해야 실제 화면이 업데이트돼요.",
      fix: "모든 그리기 명령 후 oled.show() 호출 필수!",
    },
    {
      level: "warn",
      title: "I2C 주소가 0x3C 또는 0x3D일 수 있어요!",
      desc: "OLED 모듈에 따라 I2C 주소가 달라요. 기본은 0x3C이지만 0x3D인 경우도 있어요.",
      fix: "i2c.scan()으로 실제 주소를 확인하세요. 코드에서 주소를 맞춰야 해요.",
    },
    {
      level: "info",
      title: "텍스트는 8픽셀 높이로 표시돼요",
      desc: "기본 폰트가 8x8 픽셀이라 한 줄에 16글자, 총 8줄까지 표시 가능해요.",
      fix: "y 좌표를 8 또는 16씩 늘려서 다음 줄에 표시하세요 (0, 8, 16, 24, ...)",
    },
    {
      level: "info",
      title: "화면 깜빡임 방지: fill(0) → 그리기 → show()",
      desc: "화면을 갱신할 때 깜빡임이 보이면 순서를 지키세요.",
      fix: "oled.fill(0)으로 지우고, 새 내용을 다 그린 다음, oled.show()를 한 번만 호출",
    },
  ],
};

export default COMMON_MISTAKES;
