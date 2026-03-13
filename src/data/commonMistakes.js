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
};

export default COMMON_MISTAKES;
