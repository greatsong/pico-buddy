// 센서/액추에이터 전체 데이터베이스 (32종 + LED)
// shield/direct 가 있는 센서만 배선/코드 데이터 제공 → 없으면 AI 튜터가 안내

export const CATEGORIES = {
  '환경':       { icon: '🌿', color: '#00ff88' },
  '소리/진동':  { icon: '🔊', color: '#ff6644' },
  '빛/색상':    { icon: '💡', color: '#ffdd00' },
  '거리/움직임': { icon: '📡', color: '#00ccff' },
  '신체':       { icon: '❤️', color: '#ff88ff' },
  '입력':       { icon: '🎮', color: '#ff8844' },
  '출력':       { icon: '🔧', color: '#88aaff' },
};

export const PROTOCOLS = {
  'I2C':     { color: '#00ff88', label: 'I2C' },
  '아날로그': { color: '#ffaa00', label: 'ADC' },
  '디지털':   { color: '#00ccff', label: 'DIO' },
  'UART':    { color: '#ff88ff', label: 'UART' },
  'PWM':     { color: '#88aaff', label: 'PWM' },
  'GPIO':    { color: '#ff6644', label: 'GPIO' },
};

const SENSORS = {
  // ═══════════════════ 환경 (8종) ═══════════════════
  DHT20: {
    id: "DHT20", name: "온습도 센서", model: "DHT20", label: "온습도 측정",
    icon: "🌡️", color: "#00ff88",
    category: "환경", protocol: "I2C", address: "0x38",
    difficulty: 2, lessons: [1, 3, 4],
    description: "온도와 습도를 동시에 측정하는 기본 환경 센서",
    shield: {
      grovePort: { name: "I2C1", type: "I2C", position: "left-bottom", color: "#00ff88" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield I2C1 포트에 꽂으세요. 풀업 저항이 내장되어 있어요.",
      code: `from machine import I2C, Pin
import time

# I2C 통신 설정 (Grove Shield I2C1 포트)
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
sensor_addr = 0x38  # DHT20의 주소
time.sleep(0.1)     # 센서 준비 대기

def read_dht20():
    # 센서에게 "측정해줘!" 명령 보내기
    i2c.writeto(sensor_addr, bytes([0xAC, 0x33, 0x00]))
    time.sleep(0.08)  # 측정 완료 대기
    # 센서에서 데이터 7바이트 읽기
    data = i2c.readfrom(sensor_addr, 7)
    # 습도 계산
    humidity = ((data[1] << 12) | (data[2] << 4) | (data[3] >> 4)) / 1048576 * 100
    # 온도 계산
    temperature = (((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]) / 1048576 * 200 - 50
    return round(temperature, 1), round(humidity, 1)

while True:
    temp, humi = read_dht20()
    print(f"온도: {temp}°C, 습도: {humi}%")
    time.sleep(2)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA=데이터), GP7(SCL=클록), 속도 100kHz" },
        { line: 5, text: "0x38은 DHT20 센서의 '주소'예요. 우편번호처럼 센서를 구분해요" },
        { line: 6, text: "센서가 준비될 때까지 0.1초 기다립니다" },
        { line: 8, text: "온습도를 읽는 함수를 만듭니다" },
        { line: 10, text: "센서에게 '측정 시작!' 명령을 보냅니다" },
        { line: 11, text: "센서가 측정을 끝낼 때까지 기다립니다" },
        { line: 13, text: "센서에서 측정 결과 데이터를 받아옵니다" },
        { line: 15, text: "받아온 데이터를 습도(%)로 변환합니다" },
        { line: 17, text: "받아온 데이터를 온도(°C)로 변환합니다" },
        { line: 18, text: "소수점 1자리까지 반올림해서 돌려줍니다" },
        { line: 20, text: "영원히 반복합니다" },
        { line: 21, text: "온도와 습도를 읽어서 temp, humi에 저장" },
        { line: 22, text: "화면에 온도와 습도를 출력합니다" },
        { line: 23, text: "2초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: "4.7kΩ 풀업 저항 2개 필수! SDA↔3.3V, SCL↔3.3V 사이에 각각 연결하세요.",
      note: "점퍼선으로 Pico WH 핀에 직접 연결.",
      code: `from machine import I2C, Pin
import time

# 직접 연결 — 내부 풀업 활성화
sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
sensor_addr = 0x38
time.sleep(0.1)

def read_dht20():
    i2c.writeto(sensor_addr, bytes([0xAC, 0x33, 0x00]))
    time.sleep(0.08)
    data = i2c.readfrom(sensor_addr, 7)
    humidity = ((data[1] << 12) | (data[2] << 4) | (data[3] >> 4)) / 1048576 * 100
    temperature = (((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]) / 1048576 * 200 - 50
    return round(temperature, 1), round(humidity, 1)

while True:
    temp, humi = read_dht20()
    print(f"온도: {temp}°C, 습도: {humi}%")
    time.sleep(2)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "DHT20 센서의 주소 0x38" },
      ],
    },
  },

  SCD41: {
    id: "SCD41", name: "CO2 센서", model: "SCD41", label: "CO2 측정",
    icon: "💨", color: "#00cc66",
    category: "환경", protocol: "I2C", address: "0x62",
    difficulty: 2, lessons: [5],
    description: "이산화탄소 농도를 정밀 측정하는 환경 센서",
    shield: {
      grovePort: { name: "I2C1", type: "I2C", position: "left-bottom", color: "#00ff88" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield I2C1 포트 사용. 첫 측정까지 5초 대기 필요.",
      code: `from machine import I2C, Pin
import time

# I2C 통신 설정
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x62  # SCD41 주소

# 주기적 측정 시작 명령
i2c.writeto(addr, bytes([0x21, 0xB1]))
time.sleep(5)  # 첫 측정 완료 대기 (5초)

def read_scd41():
    # 데이터 준비 확인
    i2c.writeto(addr, bytes([0xE4, 0xB8]))
    time.sleep(0.001)
    ready = i2c.readfrom(addr, 3)
    if (ready[0] << 8 | ready[1]) & 0x07FF == 0:
        return None
    # 측정 데이터 읽기
    i2c.writeto(addr, bytes([0xEC, 0x05]))
    time.sleep(0.001)
    data = i2c.readfrom(addr, 9)
    co2 = data[0] << 8 | data[1]
    temp = -45 + 175 * (data[3] << 8 | data[4]) / 65536
    humi = 100 * (data[6] << 8 | data[7]) / 65536
    return co2, round(temp, 1), round(humi, 1)

while True:
    result = read_scd41()
    if result:
        co2, temp, humi = result
        print(f"CO2: {co2}ppm, 온도: {temp}°C, 습도: {humi}%")
    time.sleep(5)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 5, text: "I2C 1번 버스, 100kHz 속도" },
        { line: 6, text: "0x62는 SCD41의 주소예요" },
        { line: 8, text: "센서에게 '계속 측정해!' 명령을 보냅니다" },
        { line: 9, text: "첫 측정이 끝날 때까지 5초 기다립니다" },
        { line: 11, text: "측정 데이터를 읽는 함수" },
        { line: 13, text: "데이터가 준비되었는지 확인하는 명령" },
        { line: 19, text: "9바이트 측정 데이터 읽기 (CO2 + 온도 + 습도)" },
        { line: 21, text: "CO2 농도 계산 (단위: ppm)" },
        { line: 22, text: "온도 계산 (°C)" },
        { line: 23, text: "습도 계산 (%)" },
        { line: 28, text: "CO2, 온도, 습도를 화면에 출력" },
        { line: 30, text: "5초마다 한 번씩 측정 (SCD41 권장 주기)" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: "4.7kΩ 풀업 저항 2개 필수!",
      note: "점퍼선 직접 연결. 측정 주기 최소 5초.",
      code: `from machine import I2C, Pin
import time

sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
addr = 0x62
i2c.writeto(addr, bytes([0x21, 0xB1]))
time.sleep(5)

def read_scd41():
    i2c.writeto(addr, bytes([0xE4, 0xB8]))
    time.sleep(0.001)
    ready = i2c.readfrom(addr, 3)
    if (ready[0] << 8 | ready[1]) & 0x07FF == 0:
        return None
    i2c.writeto(addr, bytes([0xEC, 0x05]))
    time.sleep(0.001)
    data = i2c.readfrom(addr, 9)
    co2 = data[0] << 8 | data[1]
    temp = -45 + 175 * (data[3] << 8 | data[4]) / 65536
    humi = 100 * (data[6] << 8 | data[7]) / 65536
    return co2, round(temp, 1), round(humi, 1)

while True:
    result = read_scd41()
    if result:
        co2, temp, humi = result
        print(f"CO2: {co2}ppm, 온도: {temp}°C, 습도: {humi}%")
    time.sleep(5)`,
      annotations: [
        { line: 4, text: "직접 연결 — 내부 풀업 저항 활성화" },
        { line: 6, text: "I2C 1번 버스로 통신 설정" },
      ],
    },
  },

  BMP280: {
    id: "BMP280", name: "기압 센서", model: "BMP280", label: "기압/고도 측정",
    icon: "🌀", color: "#88ddaa",
    category: "환경", protocol: "I2C", address: "0x76",
    difficulty: 2, lessons: [],
    description: "대기압과 고도를 측정하는 센서",
    shield: {
      grovePort: { name: "I2C1", type: "I2C", position: "left-bottom", color: "#00ff88" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield I2C1 포트 사용. 고도 계산 가능.",
      code: `from machine import I2C, Pin
import time, struct

# I2C 통신 설정
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x76  # BMP280 주소

# 보정 데이터 읽기
cal = i2c.readfrom_mem(addr, 0x88, 26)
dig_T1 = cal[0] | (cal[1] << 8)
dig_T2 = (cal[2] | (cal[3] << 8))
if dig_T2 > 32767: dig_T2 -= 65536
dig_T3 = (cal[4] | (cal[5] << 8))
if dig_T3 > 32767: dig_T3 -= 65536

# 측정 모드 설정 (온도+기압, 보통 모드)
i2c.writeto_mem(addr, 0xF4, bytes([0x27]))

def read_bmp280():
    data = i2c.readfrom_mem(addr, 0xF7, 6)
    raw_p = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
    raw_t = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
    # 온도 보정
    v1 = (raw_t / 16384.0 - dig_T1 / 1024.0) * dig_T2
    v2 = ((raw_t / 131072.0 - dig_T1 / 8192.0) ** 2) * dig_T3
    temp = (v1 + v2) / 5120.0
    return round(temp, 1)

while True:
    temp = read_bmp280()
    print(f"온도: {temp}°C")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 5, text: "I2C 1번 버스, 100kHz 속도" },
        { line: 6, text: "0x76은 BMP280의 기본 주소예요 (0x77일 수도 있음)" },
        { line: 8, text: "센서 내부 보정 데이터를 읽어옵니다 (정확한 측정에 필요)" },
        { line: 16, text: "온도+기압 측정 모드로 설정합니다" },
        { line: 19, text: "기압과 온도 원시 데이터를 읽습니다" },
        { line: 23, text: "보정 데이터로 정확한 온도를 계산합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: "4.7kΩ 풀업 저항 2개 필수!",
      note: "점퍼선 직접 연결.",
      code: `from machine import I2C, Pin
import time, struct

sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
addr = 0x76

cal = i2c.readfrom_mem(addr, 0x88, 26)
dig_T1 = cal[0] | (cal[1] << 8)
dig_T2 = (cal[2] | (cal[3] << 8))
if dig_T2 > 32767: dig_T2 -= 65536
dig_T3 = (cal[4] | (cal[5] << 8))
if dig_T3 > 32767: dig_T3 -= 65536
i2c.writeto_mem(addr, 0xF4, bytes([0x27]))

def read_bmp280():
    data = i2c.readfrom_mem(addr, 0xF7, 6)
    raw_t = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
    v1 = (raw_t / 16384.0 - dig_T1 / 1024.0) * dig_T2
    v2 = ((raw_t / 131072.0 - dig_T1 / 8192.0) ** 2) * dig_T3
    temp = (v1 + v2) / 5120.0
    return round(temp, 1)

while True:
    temp = read_bmp280()
    print(f"온도: {temp}°C")
    time.sleep(1)`,
      annotations: [
        { line: 4, text: "직접 연결 — 풀업 저항 활성화" },
        { line: 6, text: "I2C 1번 버스로 통신 설정" },
      ],
    },
  },

  HM3301: {
    id: "HM3301", name: "미세먼지 센서", model: "HM3301", label: "PM2.5/PM10 측정",
    icon: "🌫️", color: "#66bb99",
    category: "환경", protocol: "I2C", address: "0x40",
    difficulty: 3, lessons: [],
    description: "PM2.5와 PM10 미세먼지 농도를 측정하는 센서",
  },

  GUVAS12D: {
    id: "GUVAS12D", name: "자외선 센서", model: "GUVA-S12D", label: "UV 지수 측정",
    icon: "☀️", color: "#ddaa00",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "자외선(UV) 지수를 측정하는 센서",
  },

  MOISTURE: {
    id: "MOISTURE", name: "토양수분 센서", model: "Moisture Sensor", label: "흙 수분 측정",
    icon: "🌱", color: "#44aa44",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [],
    description: "흙의 수분량을 측정하는 센서",
  },

  TDS: {
    id: "TDS", name: "수질 센서", model: "TDS Sensor", label: "수질 측정",
    icon: "💧", color: "#44aadd",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "수질(총용존고형물)을 측정하는 센서",
  },

  MULTIGAS: {
    id: "MULTIGAS", name: "복합 가스 센서", model: "Multichannel Gas v2", label: "다종 가스 측정",
    icon: "🧪", color: "#22aa88",
    category: "환경", protocol: "I2C", address: "0x08",
    difficulty: 3, lessons: [],
    description: "NO2, CO, VOC 등 여러 가스를 동시에 측정하는 센서",
  },

  // ═══════════════════ 소리/진동 (3종) ═══════════════════
  SOUND: {
    id: "SOUND", name: "소리 센서", model: "Sound Sensor", label: "소음 레벨 측정",
    icon: "🎤", color: "#ff6644",
    category: "소리/진동", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [6],
    description: "주변 소음 레벨을 측정하는 센서",
  },

  VIBRATION_SENSOR: {
    id: "VIBRATION_SENSOR", name: "진동 센서", model: "Vibration Sensor", label: "진동 감지",
    icon: "📳", color: "#ff8855",
    category: "소리/진동", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "진동을 감지하는 센서 (있음/없음)",
  },

  VIBRATION_MOTOR: {
    id: "VIBRATION_MOTOR", name: "진동 모터", model: "Vibration Motor", label: "진동 출력",
    icon: "📲", color: "#ff7744",
    category: "소리/진동", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "진동을 출력하는 모터 (햅틱 피드백)",
  },

  // ═══════════════════ 빛/색상 (4종) ═══════════════════
  LIGHT: {
    id: "LIGHT", name: "빛 센서", model: "Light Sensor v1.2", label: "밝기 측정",
    icon: "🔆", color: "#ffdd00",
    category: "빛/색상", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [2, 4],
    description: "주변 밝기를 측정하는 기본 광센서",
  },

  TSL2591: {
    id: "TSL2591", name: "디지털 빛 센서", model: "TSL2591", label: "정밀 조도 측정",
    icon: "💡", color: "#eebb00",
    category: "빛/색상", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "정밀 조도(럭스)를 측정하는 디지털 광센서",
  },

  TCS34725: {
    id: "TCS34725", name: "색상 센서", model: "TCS34725", label: "RGB 색상 인식",
    icon: "🎨", color: "#ddcc00",
    category: "빛/색상", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "RGB 색상을 인식하는 컬러 센서",
  },

  IR_RECEIVER: {
    id: "IR_RECEIVER", name: "적외선 수신 센서", model: "IR Receiver", label: "리모컨 신호 수신",
    icon: "📡", color: "#cc9900",
    category: "빛/색상", protocol: "디지털", address: null,
    difficulty: 2, lessons: [],
    description: "리모컨 적외선 신호를 수신하는 센서",
  },

  // ═══════════════════ 거리/움직임 (6종) ═══════════════════
  ULTRASONIC: {
    id: "ULTRASONIC", name: "초음파 거리 센서", model: "Ultrasonic Ranger v2", label: "거리 측정",
    icon: "📏", color: "#00ccff",
    category: "거리/움직임", protocol: "디지털", address: null,
    difficulty: 2, lessons: [8],
    description: "초음파로 거리를 측정하는 센서 (2~400cm)",
  },

  VL53L0X: {
    id: "VL53L0X", name: "ToF 거리 센서", model: "VL53L0X", label: "레이저 거리 측정",
    icon: "🎯", color: "#0099dd",
    category: "거리/움직임", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "레이저로 정밀 거리를 측정하는 센서 (~2m)",
  },

  PIR: {
    id: "PIR", name: "PIR 동작 센서", model: "PIR Motion Sensor", label: "동작 감지",
    icon: "🚶", color: "#00aacc",
    category: "거리/움직임", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "사람의 움직임을 감지하는 적외선 센서",
  },

  ADXL345: {
    id: "ADXL345", name: "3축 가속도 센서", model: "ADXL345", label: "가속도/기울기 측정",
    icon: "📐", color: "#0088bb",
    category: "거리/움직임", protocol: "I2C", address: "0x53",
    difficulty: 3, lessons: [],
    description: "3축 가속도와 기울기를 측정하는 센서",
  },

  MPU6050: {
    id: "MPU6050", name: "자이로+가속도 센서", model: "MPU6050", label: "6축 모션 센싱",
    icon: "🌐", color: "#0077aa",
    category: "거리/움직임", protocol: "I2C", address: "0x68",
    difficulty: 3, lessons: [],
    description: "6축 모션 센싱 (가속도 3축 + 자이로 3축)",
  },

  GPS: {
    id: "GPS", name: "GPS 센서", model: "Air530", label: "위치/속도 측정",
    icon: "🛰️", color: "#006699",
    category: "거리/움직임", protocol: "UART", address: null,
    difficulty: 3, lessons: [],
    description: "GPS 위성으로 위치와 속도를 측정하는 센서",
  },

  // ═══════════════════ 신체 (3종) ═══════════════════
  PULSE: {
    id: "PULSE", name: "심박 센서", model: "Pulse Sensor", label: "심박수 측정",
    icon: "💓", color: "#ff88ff",
    category: "신체", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [7],
    description: "손가락 끝에서 심박수를 측정하는 센서",
  },

  GSR: {
    id: "GSR", name: "GSR 피부전도 센서", model: "GSR Sensor", label: "스트레스 측정",
    icon: "🖐️", color: "#dd66dd",
    category: "신체", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "피부 전기 전도도를 측정하는 센서 (스트레스 지표)",
  },

  MLX90614: {
    id: "MLX90614", name: "비접촉 체온 센서", model: "MLX90614", label: "비접촉 온도 측정",
    icon: "🌡️", color: "#cc44cc",
    category: "신체", protocol: "I2C", address: "0x5A",
    difficulty: 2, lessons: [],
    description: "비접촉으로 물체/체온을 측정하는 적외선 온도 센서",
  },

  // ═══════════════════ 입력 (4종) ═══════════════════
  BUTTON: {
    id: "BUTTON", name: "버튼", model: "Button", label: "푸시 버튼",
    icon: "🔘", color: "#ff8844",
    category: "입력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "누르면 신호가 가는 스위치예요. LED와 함께 쓰면 재밌어요!",
    shield: {
      grovePort: { name: "D8", type: "디지털", position: "right-top", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 11, picoName: "GP8", gp: 8, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 13, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D8 포트 사용.",
      code: `from machine import Pin
import time

# GP8번 핀을 입력(IN) + 풀업 저항 설정
btn = Pin(8, Pin.IN, Pin.PULL_UP)

while True:
    if btn.value() == 0:  # 버튼이 눌리면 0
        print("버튼 눌림!")
    time.sleep(0.1)  # 0.1초마다 확인`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP8번 핀을 '입력 모드'로 설정합니다. 입력 = 외부 신호를 읽음" },
        { line: 5, text: "PULL_UP은 버튼을 안 눌렀을 때 '1', 눌렀을 때 '0'이 되도록 해요" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 8, text: "btn.value()가 0이면 = 버튼이 눌린 상태" },
        { line: 9, text: "눌렸다는 메시지를 화면에 출력합니다" },
        { line: 10, text: "0.1초마다 버튼 상태를 확인합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "한쪽", pico: 11, picoName: "GP8", gp: 8, wire: "#ffdd00", label: "노랑" },
        { sensor: "다른쪽", pico: 13, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: "PULL_UP 설정 필수. 눌리면 0, 안 눌리면 1 (직관과 반대!)",
      note: "점퍼선 직접 연결. 4핀 버튼은 대각선 두 핀을 사용하세요.",
      code: `from machine import Pin
import time

btn = Pin(8, Pin.IN, Pin.PULL_UP)

while True:
    if btn.value() == 0:
        print("버튼 눌림!")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "Pico의 핀 기능을 가져옵니다" },
        { line: 4, text: "GP8을 입력 + 풀업 저항으로 설정" },
        { line: 7, text: "값이 0이면 버튼이 눌린 것" },
        { line: 8, text: "눌렸다는 메시지 출력" },
      ],
    },
  },

  ROTARY: {
    id: "ROTARY", name: "로터리 앵글 센서", model: "Rotary Angle Sensor", label: "회전 입력",
    icon: "🎛️", color: "#ee7733",
    category: "입력", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [],
    description: "회전 각도를 입력하는 가변저항 센서",
  },

  JOYSTICK: {
    id: "JOYSTICK", name: "조이스틱", model: "Thumb Joystick", label: "2축 방향 입력",
    icon: "🕹️", color: "#dd6622",
    category: "입력", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "X/Y 2축 방향 입력 장치",
  },

  TOUCH: {
    id: "TOUCH", name: "터치 센서", model: "Touch Sensor", label: "터치 감지",
    icon: "👆", color: "#cc5511",
    category: "입력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "손가락 터치를 감지하는 정전식 센서",
  },

  // ═══════════════════ 출력 (5종, LED 포함) ═══════════════════
  LED: {
    id: "LED", name: "LED", model: "LED", label: "LED 깜빡이기",
    icon: "💡", color: "#88aaff",
    category: "출력", protocol: "GPIO", address: null,
    difficulty: 1, lessons: [],
    description: "전기 신호로 켜고 끄는 작은 전구예요. Pico의 첫 번째 프로젝트로 딱!",
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요.",
      code: `from machine import Pin
import time

# GP16번 핀을 출력(OUT)으로 설정
led = Pin(16, Pin.OUT)

while True:
    led.on()       # LED 켜기
    time.sleep(0.5) # 0.5초 대기
    led.off()      # LED 끄기
    time.sleep(0.5) # 0.5초 대기`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능(대기 등)을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 '출력 모드'로 설정합니다. 출력 = Pico가 전기를 내보냄" },
        { line: 5, text: "led라는 이름으로 이 핀을 사용하겠다는 뜻이에요" },
        { line: 7, text: "while True: 는 '영원히 반복해'라는 뜻이에요" },
        { line: 8, text: "LED를 켭니다 (전기를 보냄)" },
        { line: 9, text: "0.5초 동안 기다립니다" },
        { line: 10, text: "LED를 끕니다 (전기를 멈춤)" },
        { line: 11, text: "0.5초 동안 기다립니다. 이후 다시 처음으로!" },
      ],
    },
    direct: {
      pins: [
        { sensor: "양극(+)", pico: 21, picoName: "GP16", gp: 16, wire: "#ff4444", label: "빨강" },
        { sensor: "음극(-)", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: "330Ω 저항을 양극(+)에 직렬 연결 필수! 없으면 LED가 즉시 망가집니다.",
      note: "점퍼선으로 직접 연결. LED의 긴 다리가 양극(+)이에요.",
      code: `from machine import Pin
import time

# GP16번 핀을 출력(OUT)으로 설정
led = Pin(16, Pin.OUT)

while True:
    led.on()       # LED 켜기
    time.sleep(0.5) # 0.5초 대기
    led.off()      # LED 끄기
    time.sleep(0.5) # 0.5초 대기`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능(대기 등)을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 '출력 모드'로 설정합니다" },
        { line: 7, text: "while True: 는 '영원히 반복해'라는 뜻이에요" },
        { line: 8, text: "LED를 켭니다" },
        { line: 9, text: "0.5초 동안 기다립니다" },
        { line: 10, text: "LED를 끕니다" },
        { line: 11, text: "0.5초 동안 기다립니다" },
      ],
    },
  },

  LED_BAR: {
    id: "LED_BAR", name: "LED 바", model: "LED Bar v2", label: "10단계 표시",
    icon: "📊", color: "#7799ff",
    category: "출력", protocol: "디지털", address: null,
    difficulty: 2, lessons: [],
    description: "10단계 LED로 값을 시각적으로 표시하는 장치",
  },

  OLED: {
    id: "OLED", name: "OLED 디스플레이", model: "SSD1306", label: "텍스트/그래픽 표시",
    icon: "🖥️", color: "#6688ee",
    category: "출력", protocol: "I2C", address: "0x3C",
    difficulty: 2, lessons: [],
    description: "128x64 픽셀 OLED에 텍스트와 그래픽을 표시",
  },

  BUZZER: {
    id: "BUZZER", name: "부저", model: "Buzzer", label: "소리 출력",
    icon: "🔔", color: "#5577dd",
    category: "출력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "소리를 출력하는 피에조 부저",
  },

  SERVO: {
    id: "SERVO", name: "서보 모터", model: "Servo Motor", label: "각도 제어",
    icon: "⚙️", color: "#4466cc",
    category: "출력", protocol: "PWM", address: null,
    difficulty: 2, lessons: [],
    description: "정확한 각도로 회전하는 모터 (0~180도)",
  },
};

// 카테고리별 센서 순서
export const SENSOR_BY_CATEGORY = Object.entries(
  Object.values(SENSORS).reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.id);
    return acc;
  }, {})
);

// 전체 센서 ID 목록 (학습 추천 순)
export const SENSOR_ORDER = [
  // 출력 (시작)
  "LED", "BUZZER",
  // 입력
  "BUTTON", "TOUCH", "ROTARY",
  // 환경 (기초 → 고급)
  "DHT20", "BMP280", "SCD41", "MOISTURE", "GUVAS12D", "TDS", "HM3301", "MULTIGAS",
  // 빛/색상
  "LIGHT", "TSL2591", "TCS34725", "IR_RECEIVER",
  // 소리/진동
  "SOUND", "VIBRATION_SENSOR", "VIBRATION_MOTOR",
  // 거리/움직임
  "ULTRASONIC", "PIR", "VL53L0X", "ADXL345", "MPU6050", "GPS",
  // 신체
  "PULSE", "GSR", "MLX90614",
  // 출력 (고급)
  "LED_BAR", "OLED", "SERVO", "JOYSTICK",
];

export default SENSORS;
