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
    difficulty: 2, lessons: [1, 3, 4], recommended: true,
    description: "온도와 습도를 동시에 측정하는 기본 환경 센서",
    grove: true,
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
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x38 in found:
    print("\\u2705 DHT20 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  SCD30: {
    id: "SCD30", name: "CO2 센서", model: "SCD30", label: "CO2 측정",
    icon: "💨", color: "#00cc66",
    category: "환경", protocol: "I2C", address: "0x61",
    difficulty: 2, lessons: [5],
    description: "이산화탄소 농도를 정밀 측정하는 NDIR 방식 환경 센서",
    grove: true,
    shield: {
      grovePort: { name: "I2C1", type: "I2C", position: "left-bottom", color: "#00ff88" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield I2C1 포트 사용. 첫 측정까지 2초 대기 필요.",
      code: `from machine import I2C, Pin
import time
import struct

# I2C 통신 설정
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=50000)
addr = 0x61  # SCD30 주소

def crc8(data):
    crc = 0xFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 0x80:
                crc = (crc << 1) ^ 0x31
            else:
                crc <<= 1
            crc &= 0xFF
    return crc

# 연속 측정 시작 (기압 보정 0 = 사용 안 함)
i2c.writeto(addr, bytes([0x00, 0x10, 0x00, 0x00, 0x81]))
time.sleep(2)  # 첫 측정 완료 대기

def read_scd30():
    # 데이터 준비 확인
    i2c.writeto(addr, bytes([0x02, 0x02]))
    time.sleep(0.01)
    ready = i2c.readfrom(addr, 3)
    if ready[0] == 0 and ready[1] == 0:
        return None
    # 측정 데이터 읽기 (18바이트)
    i2c.writeto(addr, bytes([0x03, 0x00]))
    time.sleep(0.01)
    data = i2c.readfrom(addr, 18)
    # CO2 (float, 4바이트)
    co2 = struct.unpack('>f', bytes([data[0], data[1], data[3], data[4]]))[0]
    # 온도 (float, 4바이트)
    temp = struct.unpack('>f', bytes([data[6], data[7], data[9], data[10]]))[0]
    # 습도 (float, 4바이트)
    humi = struct.unpack('>f', bytes([data[12], data[13], data[15], data[16]]))[0]
    return round(co2, 0), round(temp, 1), round(humi, 1)

while True:
    result = read_scd30()
    if result:
        co2, temp, humi = result
        print(f"CO2: {int(co2)}ppm, 온도: {temp}°C, 습도: {humi}%")
    time.sleep(2)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 3, text: "struct 모듈로 바이트를 실수(float)로 변환합니다" },
        { line: 6, text: "I2C 1번 버스, 50kHz (SCD30은 낮은 속도 권장)" },
        { line: 7, text: "0x61은 SCD30의 주소예요" },
        { line: 9, text: "CRC 체크섬 함수 (데이터 검증용)" },
        { line: 22, text: "연속 측정 시작 명령을 보냅니다" },
        { line: 23, text: "첫 측정이 끝날 때까지 2초 기다립니다" },
        { line: 25, text: "측정 데이터를 읽는 함수" },
        { line: 27, text: "데이터가 준비되었는지 확인하는 명령" },
        { line: 33, text: "18바이트 측정 데이터 읽기 (CO2 + 온도 + 습도)" },
        { line: 36, text: "CO2 농도를 float로 변환 (단위: ppm)" },
        { line: 38, text: "온도를 float로 변환 (°C)" },
        { line: 40, text: "습도를 float로 변환 (%)" },
        { line: 46, text: "CO2, 온도, 습도를 화면에 출력" },
        { line: 48, text: "2초마다 한 번씩 측정 (SCD30 기본 주기)" },
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
      note: "점퍼선 직접 연결. 측정 주기 최소 2초.",
      code: `from machine import I2C, Pin
import time
import struct

sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=50000)
addr = 0x61
i2c.writeto(addr, bytes([0x00, 0x10, 0x00, 0x00, 0x81]))
time.sleep(2)

def read_scd30():
    i2c.writeto(addr, bytes([0x02, 0x02]))
    time.sleep(0.01)
    ready = i2c.readfrom(addr, 3)
    if ready[0] == 0 and ready[1] == 0:
        return None
    i2c.writeto(addr, bytes([0x03, 0x00]))
    time.sleep(0.01)
    data = i2c.readfrom(addr, 18)
    co2 = struct.unpack('>f', bytes([data[0], data[1], data[3], data[4]]))[0]
    temp = struct.unpack('>f', bytes([data[6], data[7], data[9], data[10]]))[0]
    humi = struct.unpack('>f', bytes([data[12], data[13], data[15], data[16]]))[0]
    return round(co2, 0), round(temp, 1), round(humi, 1)

while True:
    result = read_scd30()
    if result:
        co2, temp, humi = result
        print(f"CO2: {int(co2)}ppm, 온도: {temp}°C, 습도: {humi}%")
    time.sleep(2)`,
      annotations: [
        { line: 5, text: "직접 연결 — 내부 풀업 저항 활성화" },
        { line: 8, text: "I2C 1번 버스, 50kHz (SCD30 권장)" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=50000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x61 in found:
    print("\\u2705 SCD30 CO2 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  BMP280: {
    id: "BMP280", name: "기압 센서", model: "AHT20+BMP280", label: "기압/고도 측정",
    icon: "🌀", color: "#88ddaa",
    category: "환경", protocol: "I2C", address: "0x76",
    difficulty: 2, lessons: [],
    description: "AHT20(온습도)+BMP280(기압) 콤보 모듈. 기압과 고도를 측정하는 센서",
    grove: true,
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
import time

# I2C 통신 설정
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x76  # BMP280 주소

# 보정 데이터 읽기 (온도 + 기압)
cal = i2c.readfrom_mem(addr, 0x88, 26)
dig_T1 = cal[0] | (cal[1] << 8)
dig_T2 = (cal[2] | (cal[3] << 8))
if dig_T2 > 32767: dig_T2 -= 65536
dig_T3 = (cal[4] | (cal[5] << 8))
if dig_T3 > 32767: dig_T3 -= 65536
dig_P1 = cal[6] | (cal[7] << 8)
dig_P2 = (cal[8] | (cal[9] << 8))
if dig_P2 > 32767: dig_P2 -= 65536
dig_P3 = (cal[10] | (cal[11] << 8))
if dig_P3 > 32767: dig_P3 -= 65536
dig_P4 = (cal[12] | (cal[13] << 8))
if dig_P4 > 32767: dig_P4 -= 65536
dig_P5 = (cal[14] | (cal[15] << 8))
if dig_P5 > 32767: dig_P5 -= 65536
dig_P6 = (cal[16] | (cal[17] << 8))
if dig_P6 > 32767: dig_P6 -= 65536
dig_P7 = (cal[18] | (cal[19] << 8))
if dig_P7 > 32767: dig_P7 -= 65536
dig_P8 = (cal[20] | (cal[21] << 8))
if dig_P8 > 32767: dig_P8 -= 65536
dig_P9 = (cal[22] | (cal[23] << 8))
if dig_P9 > 32767: dig_P9 -= 65536

# 측정 모드 설정 (온도+기압, 보통 모드)
i2c.writeto_mem(addr, 0xF4, bytes([0x27]))

def read_bmp280():
    data = i2c.readfrom_mem(addr, 0xF7, 6)
    raw_p = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
    raw_t = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
    # 온도 보정
    v1 = (raw_t / 16384.0 - dig_T1 / 1024.0) * dig_T2
    v2 = ((raw_t / 131072.0 - dig_T1 / 8192.0) ** 2) * dig_T3
    t_fine = v1 + v2
    temp = t_fine / 5120.0
    # 기압 보정
    p1 = t_fine / 2.0 - 64000.0
    p2 = p1 * p1 * dig_P6 / 32768.0
    p2 = p2 + p1 * dig_P5 * 2.0
    p2 = p2 / 4.0 + dig_P4 * 65536.0
    p1 = (dig_P3 * p1 * p1 / 524288.0 + dig_P2 * p1) / 524288.0
    p1 = (1.0 + p1 / 32768.0) * dig_P1
    if p1 == 0:
        return round(temp, 1), 0, 0
    pressure = 1048576.0 - raw_p
    pressure = (pressure - p2 / 4096.0) * 6250.0 / p1
    p1 = dig_P9 * pressure * pressure / 2147483648.0
    p2 = pressure * dig_P8 / 32768.0
    pressure = pressure + (p1 + p2 + dig_P7) / 16.0
    hpa = pressure / 100.0
    # 고도 계산 (표준 기압 1013.25 hPa 기준)
    alt = 44330.0 * (1.0 - (hpa / 1013.25) ** 0.1903)
    return round(temp, 1), round(hpa, 1), round(alt, 1)

while True:
    temp, hpa, alt = read_bmp280()
    print(f"온도: {temp}°C, 기압: {hpa} hPa, 고도: {alt} m")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 5, text: "I2C 1번 버스, 100kHz 속도" },
        { line: 6, text: "0x76은 BMP280의 기본 주소예요 (0x77일 수도 있음)" },
        { line: 8, text: "센서 내부 보정 데이터를 읽어옵니다 (온도 + 기압 보정에 필요)" },
        { line: 34, text: "온도+기압 측정 모드로 설정합니다" },
        { line: 37, text: "기압과 온도 원시 데이터를 읽습니다" },
        { line: 42, text: "보정 데이터로 정확한 온도를 계산합니다" },
        { line: 46, text: "보정 데이터로 정확한 기압(hPa)을 계산합니다" },
        { line: 59, text: "기압으로부터 대략적인 고도를 계산합니다" },
        { line: 63, text: "온도, 기압, 고도를 모두 출력합니다" },
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
import time

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
dig_P1 = cal[6] | (cal[7] << 8)
dig_P2 = (cal[8] | (cal[9] << 8))
if dig_P2 > 32767: dig_P2 -= 65536
dig_P3 = (cal[10] | (cal[11] << 8))
if dig_P3 > 32767: dig_P3 -= 65536
dig_P4 = (cal[12] | (cal[13] << 8))
if dig_P4 > 32767: dig_P4 -= 65536
dig_P5 = (cal[14] | (cal[15] << 8))
if dig_P5 > 32767: dig_P5 -= 65536
dig_P6 = (cal[16] | (cal[17] << 8))
if dig_P6 > 32767: dig_P6 -= 65536
dig_P7 = (cal[18] | (cal[19] << 8))
if dig_P7 > 32767: dig_P7 -= 65536
dig_P8 = (cal[20] | (cal[21] << 8))
if dig_P8 > 32767: dig_P8 -= 65536
dig_P9 = (cal[22] | (cal[23] << 8))
if dig_P9 > 32767: dig_P9 -= 65536
i2c.writeto_mem(addr, 0xF4, bytes([0x27]))

def read_bmp280():
    data = i2c.readfrom_mem(addr, 0xF7, 6)
    raw_p = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
    raw_t = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
    v1 = (raw_t / 16384.0 - dig_T1 / 1024.0) * dig_T2
    v2 = ((raw_t / 131072.0 - dig_T1 / 8192.0) ** 2) * dig_T3
    t_fine = v1 + v2
    temp = t_fine / 5120.0
    # 기압 보정
    p1 = t_fine / 2.0 - 64000.0
    p2 = p1 * p1 * dig_P6 / 32768.0
    p2 = p2 + p1 * dig_P5 * 2.0
    p2 = p2 / 4.0 + dig_P4 * 65536.0
    p1 = (dig_P3 * p1 * p1 / 524288.0 + dig_P2 * p1) / 524288.0
    p1 = (1.0 + p1 / 32768.0) * dig_P1
    if p1 == 0:
        return round(temp, 1), 0, 0
    pressure = 1048576.0 - raw_p
    pressure = (pressure - p2 / 4096.0) * 6250.0 / p1
    p1 = dig_P9 * pressure * pressure / 2147483648.0
    p2 = pressure * dig_P8 / 32768.0
    pressure = pressure + (p1 + p2 + dig_P7) / 16.0
    hpa = pressure / 100.0
    alt = 44330.0 * (1.0 - (hpa / 1013.25) ** 0.1903)
    return round(temp, 1), round(hpa, 1), round(alt, 1)

while True:
    temp, hpa, alt = read_bmp280()
    print(f"온도: {temp}°C, 기압: {hpa} hPa, 고도: {alt} m")
    time.sleep(1)`,
      annotations: [
        { line: 4, text: "직접 연결 — 풀업 저항 활성화" },
        { line: 6, text: "I2C 1번 버스로 통신 설정" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x76 in found:
    print("\\u2705 BMP280 기압 센서를 찾았어요! (주소: 0x76)")
elif 0x77 in found:
    print("\\u2705 BMP280 기압 센서를 찾았어요! (주소: 0x77)")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  HM3301: {
    id: "HM3301", name: "미세먼지 센서", model: "HM3301", label: "PM2.5/PM10 측정",
    icon: "🌫️", color: "#66bb99",
    category: "환경", protocol: "I2C", address: "0x40",
    difficulty: 3, lessons: [],
    description: "PM2.5와 PM10 미세먼지 농도를 측정하는 센서",
    grove: true,
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
sensor_addr = 0x40  # HM3301의 주소
time.sleep(0.1)     # 센서 준비 대기

def read_hm3301():
    # 센서에서 29바이트 데이터 읽기
    data = i2c.readfrom(sensor_addr, 29)
    # PM1.0 농도 (대기환경 기준, ug/m3)
    pm1_0 = (data[4] << 8) | data[5]
    # PM2.5 농도 (대기환경 기준, ug/m3)
    pm2_5 = (data[6] << 8) | data[7]
    # PM10 농도 (대기환경 기준, ug/m3)
    pm10 = (data[8] << 8) | data[9]
    return pm1_0, pm2_5, pm10

while True:
    pm1, pm25, pm10 = read_hm3301()
    print(f"PM1.0: {pm1} ug/m3")
    print(f"PM2.5: {pm25} ug/m3")
    print(f"PM10 : {pm10} ug/m3")
    # 미세먼지 등급 판정
    if pm25 <= 15:
        print("공기질: 좋음 😊")
    elif pm25 <= 35:
        print("공기질: 보통 🙂")
    elif pm25 <= 75:
        print("공기질: 나쁨 😷")
    else:
        print("공기질: 매우나쁨 🚫")
    print("---")
    time.sleep(3)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA=데이터), GP7(SCL=클록), 속도 100kHz" },
        { line: 5, text: "0x40은 HM3301 미세먼지 센서의 주소예요" },
        { line: 6, text: "센서가 준비될 때까지 0.1초 기다립니다" },
        { line: 8, text: "미세먼지를 읽는 함수를 만듭니다" },
        { line: 10, text: "센서에서 29바이트의 측정 데이터를 받아옵니다" },
        { line: 12, text: "PM1.0 초미세먼지 농도를 계산합니다 (단위: ug/m3)" },
        { line: 14, text: "PM2.5 미세먼지 농도를 계산합니다" },
        { line: 16, text: "PM10 미세먼지 농도를 계산합니다" },
        { line: 17, text: "세 가지 미세먼지 값을 돌려줍니다" },
        { line: 19, text: "영원히 반복합니다" },
        { line: 20, text: "미세먼지 데이터를 읽어서 변수에 저장" },
        { line: 21, text: "PM1.0 값을 화면에 출력합니다" },
        { line: 22, text: "PM2.5 값을 화면에 출력합니다" },
        { line: 23, text: "PM10 값을 화면에 출력합니다" },
        { line: 25, text: "PM2.5 기준으로 공기질 등급을 판정합니다" },
        { line: 34, text: "3초마다 한 번씩 측정합니다" },
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
sensor_addr = 0x40
time.sleep(0.1)

def read_hm3301():
    data = i2c.readfrom(sensor_addr, 29)
    pm1_0 = (data[4] << 8) | data[5]
    pm2_5 = (data[6] << 8) | data[7]
    pm10 = (data[8] << 8) | data[9]
    return pm1_0, pm2_5, pm10

while True:
    pm1, pm25, pm10 = read_hm3301()
    print(f"PM1.0: {pm1} ug/m3")
    print(f"PM2.5: {pm25} ug/m3")
    print(f"PM10 : {pm10} ug/m3")
    if pm25 <= 15:
        print("공기질: 좋음 😊")
    elif pm25 <= 35:
        print("공기질: 보통 🙂")
    elif pm25 <= 75:
        print("공기질: 나쁨 😷")
    else:
        print("공기질: 매우나쁨 🚫")
    print("---")
    time.sleep(3)`,
      annotations: [
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "HM3301 센서의 주소 0x40" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x40 in found:
    print("\\u2705 HM3301 미세먼지 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  GUVAS12D: {
    id: "GUVAS12D", name: "자외선 센서", model: "GUVA-S12D", label: "UV 지수 측정",
    icon: "☀️", color: "#ddaa00",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "자외선(UV) 지수를 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "A0", type: "아날로그", position: "left-top", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A0 포트에 꽂으세요. ADC로 자외선 강도를 읽어요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
uv_sensor = ADC(Pin(26))

while True:
    # UV 센서 값 읽기 (0~65535)
    raw = uv_sensor.read_u16()
    # 전압으로 변환 (3.3V 기준)
    voltage = raw / 65535 * 3.3
    # UV 지수 계산 (전압에 비례)
    uv_index = voltage / 0.1
    print(f"UV 원시값: {raw}, 전압: {voltage:.2f}V, UV지수: {uv_index:.1f}")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP26번 핀을 아날로그 입력으로 설정합니다 (ADC0)" },
        { line: 5, text: "uv_sensor라는 이름으로 UV 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "UV 센서의 아날로그 값을 16비트(0~65535)로 읽습니다" },
        { line: 11, text: "ADC 값을 전압(0~3.3V)으로 변환합니다" },
        { line: 13, text: "전압을 UV 지수로 변환합니다 (0.1V당 UV 지수 1)" },
        { line: 14, text: "원시값, 전압, UV 지수를 화면에 출력합니다" },
        { line: 15, text: "1초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
uv_sensor = ADC(Pin(26))

while True:
    raw = uv_sensor.read_u16()
    voltage = raw / 65535 * 3.3
    uv_index = voltage / 0.1
    print(f"UV지수: {uv_index:.1f} (전압: {voltage:.2f}V)")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP26을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "전압으로 변환합니다 (3.3V 기준)" },
        { line: 10, text: "UV 지수로 변환합니다" },
      ],
    },
    initCheck: `# UV 센서 테스트
from machine import ADC, Pin
uv = ADC(Pin(26))
val = uv.read_u16()
print(f"UV 센서 값: {val}")
if val > 0:
    print("\\u2705 UV 센서가 동작해요!")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  MOISTURE: {
    id: "MOISTURE", name: "토양수분 센서", model: "Moisture Sensor", label: "흙 수분 측정",
    icon: "🌱", color: "#44aa44",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [],
    description: "흙의 수분량을 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "A0", type: "아날로그", position: "left-top", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A0 포트에 꽂으세요. 센서를 흙에 꽂아서 수분을 측정해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
moisture = ADC(Pin(26))

while True:
    # 토양수분 센서 값 읽기 (0~65535)
    raw = moisture.read_u16()
    # 퍼센트로 변환 (값이 클수록 수분 많음)
    percent = round(raw / 65535 * 100, 1)
    # 수분 상태 판정
    if percent > 60:
        status = "충분히 젖어 있어요"
    elif percent > 30:
        status = "적당한 수분이에요"
    else:
        status = "건조해요! 물을 주세요"
    print(f"수분: {raw} ({percent}%) - {status}")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP26번 핀을 아날로그 입력으로 설정합니다 (ADC0)" },
        { line: 5, text: "moisture라는 이름으로 토양수분 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "토양수분 센서의 아날로그 값을 읽습니다 (0~65535)" },
        { line: 11, text: "65535를 100%로 놓고 퍼센트로 변환합니다" },
        { line: 13, text: "수분 상태를 조건문으로 판정합니다" },
        { line: 14, text: "60% 이상이면 충분히 젖어 있는 상태" },
        { line: 16, text: "30% 이상이면 적당한 수분" },
        { line: 18, text: "30% 미만이면 건조한 상태" },
        { line: 19, text: "수분값과 상태를 화면에 출력합니다" },
        { line: 20, text: "1초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
moisture = ADC(Pin(26))

while True:
    raw = moisture.read_u16()
    percent = round(raw / 65535 * 100, 1)
    print(f"토양수분: {percent}% (원시값: {raw})")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP26을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "퍼센트로 변환합니다" },
      ],
    },
    initCheck: `# 토양수분 센서 테스트
from machine import ADC, Pin
m = ADC(Pin(26))
val = m.read_u16()
print(f"토양수분 센서 값: {val}")
if val > 0:
    print("\\u2705 토양수분 센서가 동작해요!")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  TDS: {
    id: "TDS", name: "수질 센서", model: "TDS Sensor", label: "수질 측정",
    icon: "💧", color: "#44aadd",
    category: "환경", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "수질(총용존고형물)을 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "A2", type: "아날로그", position: "left-middle", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A2 포트에 꽂으세요. 센서를 물에 담가서 수질을 측정해요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
tds_sensor = ADC(Pin(27))

while True:
    # TDS 센서 값 읽기 (0~65535)
    raw = tds_sensor.read_u16()
    # 전압으로 변환 (3.3V 기준)
    voltage = raw / 65535 * 3.3
    # TDS 값 계산 (ppm)
    tds_value = (133.42 * voltage ** 3 - 255.86 * voltage ** 2 + 857.39 * voltage) * 0.5
    # 수질 판정
    if tds_value < 50:
        quality = "매우 깨끗 (정수)"
    elif tds_value < 150:
        quality = "깨끗 (음용 가능)"
    elif tds_value < 300:
        quality = "보통 (일반 수돗물)"
    else:
        quality = "오염됨 (음용 부적합)"
    print(f"TDS: {tds_value:.0f}ppm, 전압: {voltage:.2f}V - {quality}")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP27번 핀을 아날로그 입력으로 설정합니다 (ADC1)" },
        { line: 5, text: "tds_sensor라는 이름으로 수질 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "TDS 센서의 아날로그 값을 읽습니다 (0~65535)" },
        { line: 11, text: "ADC 값을 전압(0~3.3V)으로 변환합니다" },
        { line: 13, text: "전압을 TDS 값(ppm)으로 변환하는 공식입니다" },
        { line: 15, text: "TDS 값으로 수질 상태를 판정합니다" },
        { line: 16, text: "50ppm 미만이면 매우 깨끗한 물" },
        { line: 18, text: "150ppm 미만이면 음용 가능한 수준" },
        { line: 20, text: "300ppm 미만이면 일반 수돗물 수준" },
        { line: 22, text: "300ppm 이상이면 오염된 상태" },
        { line: 23, text: "TDS 값과 수질 상태를 출력합니다" },
        { line: 24, text: "1초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
tds_sensor = ADC(Pin(27))

while True:
    raw = tds_sensor.read_u16()
    voltage = raw / 65535 * 3.3
    tds_value = (133.42 * voltage ** 3 - 255.86 * voltage ** 2 + 857.39 * voltage) * 0.5
    print(f"TDS: {tds_value:.0f}ppm (전압: {voltage:.2f}V)")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP27을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "전압으로 변환합니다 (3.3V 기준)" },
        { line: 10, text: "전압을 TDS(ppm)로 변환합니다" },
      ],
    },
    initCheck: `# 수질 센서 테스트
from machine import ADC, Pin
tds = ADC(Pin(27))
val = tds.read_u16()
print(f"TDS 센서 값: {val}")
if val > 0:
    print("\\u2705 수질(TDS) 센서가 동작해요!")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  MULTIGAS: {
    id: "MULTIGAS", name: "복합 가스 센서", model: "Multichannel Gas v2", label: "다종 가스 측정",
    icon: "🧪", color: "#22aa88",
    category: "환경", protocol: "I2C", address: "0x08",
    difficulty: 3, lessons: [],
    description: "NO2, CO, VOC 등 여러 가스를 동시에 측정하는 센서",
    grove: true,
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
import struct

# I2C 통신 설정 (Grove Shield I2C1 포트)
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x08  # Multichannel Gas v2 주소
time.sleep(1)  # 센서 예열 대기

# 가스 채널 레지스터 주소
GM_NO2 = 0x01   # NO2 (이산화질소)
GM_C2H5OH = 0x02  # 에탄올
GM_VOC = 0x03   # VOC (휘발성유기화합물)
GM_CO = 0x04    # CO (일산화탄소)

def read_gas(channel):
    # 채널 데이터 요청 및 읽기
    buf = bytearray(4)
    i2c.writeto(addr, bytes([channel]))
    time.sleep(0.05)
    i2c.readfrom_into(addr, buf)
    # 4바이트를 부호 없는 32비트 정수로 변환
    value = struct.unpack('<I', buf)[0]
    return value

while True:
    no2 = read_gas(GM_NO2)
    co = read_gas(GM_CO)
    voc = read_gas(GM_VOC)
    eth = read_gas(GM_C2H5OH)
    print(f"NO2: {no2}")
    print(f"CO : {co}")
    print(f"VOC: {voc}")
    print(f"에탄올: {eth}")
    print("---")
    time.sleep(2)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 3, text: "바이트 데이터를 숫자로 변환하는 struct 모듈" },
        { line: 5, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 6, text: "0x08은 Multichannel Gas v2 센서의 주소예요" },
        { line: 7, text: "가스 센서는 예열이 필요해요. 1초 대기합니다" },
        { line: 9, text: "각 가스 채널의 레지스터 주소를 정의합니다" },
        { line: 10, text: "NO2(이산화질소) 채널: 0x01" },
        { line: 11, text: "에탄올 채널: 0x02" },
        { line: 12, text: "VOC(휘발성유기화합물) 채널: 0x03" },
        { line: 13, text: "CO(일산화탄소) 채널: 0x04" },
        { line: 15, text: "특정 가스 채널 값을 읽는 함수" },
        { line: 17, text: "4바이트 버퍼를 준비합니다" },
        { line: 18, text: "읽고 싶은 채널 번호를 센서에 보냅니다" },
        { line: 20, text: "센서에서 4바이트 데이터를 읽어옵니다" },
        { line: 22, text: "바이트를 정수로 변환합니다 (리틀엔디안)" },
        { line: 25, text: "영원히 반복합니다" },
        { line: 26, text: "NO2 가스 값을 읽습니다" },
        { line: 27, text: "CO 가스 값을 읽습니다" },
        { line: 28, text: "VOC 가스 값을 읽습니다" },
        { line: 29, text: "에탄올 가스 값을 읽습니다" },
        { line: 35, text: "2초마다 한 번씩 측정합니다" },
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
import struct

# 직접 연결 — 내부 풀업 활성화
sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
addr = 0x08
time.sleep(1)

GM_NO2 = 0x01
GM_C2H5OH = 0x02
GM_VOC = 0x03
GM_CO = 0x04

def read_gas(channel):
    buf = bytearray(4)
    i2c.writeto(addr, bytes([channel]))
    time.sleep(0.05)
    i2c.readfrom_into(addr, buf)
    value = struct.unpack('<I', buf)[0]
    return value

while True:
    no2 = read_gas(GM_NO2)
    co = read_gas(GM_CO)
    voc = read_gas(GM_VOC)
    eth = read_gas(GM_C2H5OH)
    print(f"NO2: {no2}")
    print(f"CO : {co}")
    print(f"VOC: {voc}")
    print(f"에탄올: {eth}")
    print("---")
    time.sleep(2)`,
      annotations: [
        { line: 5, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 6, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 8, text: "I2C 1번 버스로 통신 설정" },
        { line: 9, text: "Multichannel Gas v2 센서의 주소 0x08" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x08 in found:
    print("\\u2705 복합 가스 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  // ═══════════════════ 소리/진동 (3종) ═══════════════════
  SOUND: {
    id: "SOUND", name: "소리 센서", model: "Grove Analog Microphone (MEMS)", label: "소음 레벨 측정",
    icon: "🎤", color: "#ff6644",
    category: "소리/진동", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [6],
    description: "MEMS 마이크로 주변 소음 레벨을 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "A2", type: "아날로그", position: "left-middle", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A2 포트에 꽂으세요. 소리가 클수록 값이 커져요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
sound_sensor = ADC(Pin(27))

while True:
    # 소리 센서 값 읽기 (0~65535)
    sound_value = sound_sensor.read_u16()
    # 소음 레벨 판정
    if sound_value > 40000:
        level = "🔊 매우 시끄러움!"
    elif sound_value > 20000:
        level = "🔉 보통 소리"
    else:
        level = "🔈 조용함"
    print(f"소음: {sound_value} - {level}")
    time.sleep(0.3)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP27번 핀을 아날로그 입력으로 설정합니다 (ADC1)" },
        { line: 5, text: "sound_sensor라는 이름으로 소리 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "소리 센서의 아날로그 값을 읽습니다 (0=무음, 65535=매우 큰 소리)" },
        { line: 11, text: "값이 40000보다 크면 매우 시끄러운 소리" },
        { line: 13, text: "값이 20000보다 크면 보통 수준의 소리" },
        { line: 15, text: "그 외에는 조용한 환경" },
        { line: 17, text: "소음 값과 레벨을 화면에 출력합니다" },
        { line: 18, text: "0.3초마다 소리를 측정합니다 (소리는 빠르게 변하니까!)" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
sound_sensor = ADC(Pin(27))

while True:
    sound_value = sound_sensor.read_u16()
    if sound_value > 40000:
        print(f"🔊 시끄러움! ({sound_value})")
    elif sound_value > 20000:
        print(f"🔉 보통 ({sound_value})")
    else:
        print(f"🔈 조용 ({sound_value})")
    time.sleep(0.3)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP27을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "조건문으로 소음 수준을 판정합니다" },
      ],
    },
    initCheck: `# 소리 센서 테스트
from machine import ADC, Pin
s = ADC(Pin(27))
val = s.read_u16()
print(f"소리 센서 값: {val}")
if val > 0:
    print("\\u2705 소리 센서가 동작해요! 박수를 쳐보세요.")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  VIBRATION_SENSOR: {
    id: "VIBRATION_SENSOR", name: "진동 센서", model: "Vibration Sensor", label: "진동 감지",
    icon: "📳", color: "#ff8855",
    category: "소리/진동", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "진동을 감지하는 센서 (있음/없음)",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. 진동이 감지되면 1이 돼요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
vib = Pin(16, Pin.IN)

count = 0
while True:
    # 진동 감지 (1=진동 있음, 0=없음)
    if vib.value() == 1:
        count += 1
        print(f"진동 감지! (총 {count}회)")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 디지털 입력으로 설정합니다" },
        { line: 5, text: "vib라는 이름으로 진동 센서를 사용합니다" },
        { line: 7, text: "진동 감지 횟수를 세는 변수입니다" },
        { line: 8, text: "영원히 반복합니다" },
        { line: 10, text: "진동이 감지되면 value()가 1이 됩니다" },
        { line: 11, text: "감지 횟수를 1 증가시킵니다" },
        { line: 12, text: "진동 감지 메시지와 누적 횟수를 출력합니다" },
        { line: 13, text: "0.1초마다 진동 상태를 확인합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. 진동이 감지되면 HIGH(1) 신호가 나와요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
vib = Pin(16, Pin.IN)

count = 0
while True:
    if vib.value() == 1:
        count += 1
        print(f"진동! ({count}회)")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "핀 기능을 가져옵니다" },
        { line: 4, text: "GP16을 디지털 입력으로 설정합니다" },
        { line: 9, text: "값이 1이면 진동이 감지된 것" },
      ],
    },
    initCheck: `# 진동 센서 테스트
from machine import Pin
vib = Pin(16, Pin.IN)
print(f"진동 센서 값: {vib.value()}")
print("센서를 톡톡 두드려보세요!")
import time
for i in range(30):
    if vib.value() == 1:
        print("\\u2705 진동이 감지됐어요!")
        break
    time.sleep(0.1)
else:
    print("3초간 진동 없음. 센서를 두드려보세요.")`,
  },

  VIBRATION_MOTOR: {
    id: "VIBRATION_MOTOR", name: "진동 모터", model: "Vibration Motor", label: "진동 출력",
    icon: "📲", color: "#ff7744",
    category: "소리/진동", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "진동을 출력하는 모터 (햅틱 피드백)",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. PWM으로 진동 세기를 조절할 수 있어요.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
motor = PWM(Pin(16))
motor.freq(1000)  # 1kHz 주파수

# 진동 세기 테스트
print("약한 진동")
motor.duty_u16(20000)
time.sleep(1)

print("중간 진동")
motor.duty_u16(40000)
time.sleep(1)

print("강한 진동")
motor.duty_u16(65535)
time.sleep(1)

# 진동 패턴 반복
while True:
    motor.duty_u16(65535)  # 진동 ON
    print("부르르~")
    time.sleep(0.3)
    motor.duty_u16(0)      # 진동 OFF
    time.sleep(0.7)`,
      annotations: [
        { line: 1, text: "핀(Pin)과 PWM 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 PWM 출력으로 설정합니다" },
        { line: 5, text: "motor라는 이름으로 진동 모터를 제어합니다" },
        { line: 6, text: "1kHz 주파수로 PWM 신호를 설정합니다" },
        { line: 8, text: "진동 세기를 단계별로 테스트합니다" },
        { line: 9, text: "duty_u16(20000)은 약 30% 세기의 진동" },
        { line: 12, text: "duty_u16(40000)은 약 60% 세기의 진동" },
        { line: 15, text: "duty_u16(65535)는 최대 세기의 진동" },
        { line: 19, text: "진동 패턴을 반복합니다" },
        { line: 20, text: "최대 세기로 0.3초 진동" },
        { line: 22, text: "0.7초 쉬기" },
      ],
    },
    direct: {
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. PWM 신호로 진동 세기를 조절할 수 있어요.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
motor = PWM(Pin(16))
motor.freq(1000)

while True:
    motor.duty_u16(65535)  # 진동 ON
    print("진동!")
    time.sleep(0.3)
    motor.duty_u16(0)      # 진동 OFF
    time.sleep(0.7)`,
      annotations: [
        { line: 1, text: "핀과 PWM 기능을 가져옵니다" },
        { line: 4, text: "GP16을 PWM 출력으로 설정합니다" },
        { line: 6, text: "1kHz 주파수 설정" },
        { line: 9, text: "duty 최대값으로 진동 ON" },
        { line: 12, text: "duty 0으로 진동 OFF" },
      ],
    },
    initCheck: `# 진동 모터 테스트
from machine import Pin, PWM
import time
motor = PWM(Pin(16))
motor.freq(1000)
motor.duty_u16(65535)
time.sleep(0.5)
motor.duty_u16(0)
print("\\u2705 진동 모터가 0.5초간 동작했어요! 느껴졌나요?")`,
  },

  // ═══════════════════ 빛/색상 (4종) ═══════════════════
  LIGHT: {
    id: "LIGHT", name: "빛 센서", model: "Light Sensor v1.2", label: "밝기 측정",
    icon: "🔆", color: "#ffdd00",
    category: "빛/색상", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [2, 4],
    description: "주변 밝기를 측정하는 기본 광센서",
    grove: true,
    shield: {
      grovePort: { name: "A0", type: "아날로그", position: "left-top", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A0 포트에 꽂으세요. ADC로 밝기를 0~65535 값으로 읽어요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
light_sensor = ADC(Pin(26))

while True:
    # 빛 센서 값 읽기 (0~65535)
    light_value = light_sensor.read_u16()
    # 퍼센트로 변환 (0~100%)
    light_percent = round(light_value / 65535 * 100, 1)
    print(f"밝기: {light_value} ({light_percent}%)")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP26번 핀을 아날로그 입력으로 설정합니다 (ADC0)" },
        { line: 5, text: "light_sensor라는 이름으로 빛 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 8, text: "빛 센서의 아날로그 값을 16비트(0~65535)로 읽습니다" },
        { line: 9, text: "read_u16()은 0(어두움)~65535(매우 밝음) 사이의 값을 돌려줘요" },
        { line: 10, text: "65535를 100%로 놓고 퍼센트로 변환합니다" },
        { line: 12, text: "밝기 값과 퍼센트를 화면에 출력합니다" },
        { line: 13, text: "0.5초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
light_sensor = ADC(Pin(26))

while True:
    light_value = light_sensor.read_u16()
    light_percent = round(light_value / 65535 * 100, 1)
    print(f"밝기: {light_value} ({light_percent}%)")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP26을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "퍼센트로 변환합니다" },
      ],
    },
    initCheck: `# 빛 센서 테스트
from machine import ADC, Pin
l = ADC(Pin(26))
val = l.read_u16()
print(f"빛 센서 값: {val}")
if val > 0:
    print("\\u2705 빛 센서가 동작해요! 손으로 가려보세요.")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  TSL2591: {
    id: "TSL2591", name: "디지털 빛 센서", model: "TSL2591", label: "정밀 조도 측정",
    icon: "💡", color: "#eebb00",
    category: "빛/색상", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "정밀 조도(럭스)를 측정하는 디지털 광센서",
    addressWarning: "이 센서는 I2C 주소 0x29를 사용합니다. TSL2591, TCS34725, VL53L0X는 같은 주소를 사용하므로 동시에 연결할 수 없습니다.",
    grove: true,
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
addr = 0x29  # TSL2591 주소
time.sleep(0.1)

# 센서 활성화: ENABLE 레지스터(0x00)에 AEN+PON 설정
# 커맨드 비트(0xA0) | 레지스터 주소(0x00) = 0xA0
i2c.writeto(addr, bytes([0xA0, 0x03]))
# 게인/시간 설정: CONTROL 레지스터(0x01)
# Medium 게인(25x), 100ms 적분 시간
i2c.writeto(addr, bytes([0xA1, 0x01]))
time.sleep(0.2)  # 적분 시간 대기

def read_tsl2591():
    # CH0 (풀 스펙트럼) 16비트 읽기
    i2c.writeto(addr, bytes([0xB4]))  # 커맨드 + CH0 Low
    ch0_data = i2c.readfrom(addr, 2)
    ch0 = ch0_data[0] | (ch0_data[1] << 8)
    # CH1 (적외선) 16비트 읽기
    i2c.writeto(addr, bytes([0xB6]))  # 커맨드 + CH1 Low
    ch1_data = i2c.readfrom(addr, 2)
    ch1 = ch1_data[0] | (ch1_data[1] << 8)
    # 간이 럭스 계산 (근사치)
    if ch0 == 0:
        return 0
    ratio = ch1 / ch0
    if ratio < 0.5:
        lux = (0.0304 * ch0) - (0.062 * ch0 * (ratio ** 1.4))
    else:
        lux = max(0, 0.0224 * ch0 - 0.031 * ch1)
    return round(lux, 1)

while True:
    lux = read_tsl2591()
    print(f"조도: {lux} lux")
    if lux < 10:
        print("매우 어두움 🌙")
    elif lux < 200:
        print("실내 조명 💡")
    elif lux < 1000:
        print("밝은 실내 ☀️")
    else:
        print("매우 밝음! 🌞")
    time.sleep(2)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 5, text: "0x29는 TSL2591 빛 센서의 주소예요" },
        { line: 8, text: "ENABLE 레지스터에 센서 전원ON + 측정ON 설정" },
        { line: 9, text: "0xA0은 '커맨드 비트'예요. 센서에게 '레지스터 설정할게!' 라는 신호" },
        { line: 10, text: "0x03 = AEN(측정 활성화) + PON(전원 켜기)" },
        { line: 12, text: "게인(감도)과 적분 시간을 설정합니다" },
        { line: 13, text: "Medium 게인(25배), 100ms 측정 시간으로 설정" },
        { line: 16, text: "조도를 읽는 함수를 만듭니다" },
        { line: 18, text: "CH0은 가시광+적외선 모두 감지하는 채널" },
        { line: 22, text: "CH1은 적외선만 감지하는 채널" },
        { line: 26, text: "두 채널의 비율로 정확한 럭스(lux)를 계산합니다" },
        { line: 33, text: "영원히 반복합니다" },
        { line: 34, text: "럭스 값을 읽어서 출력합니다" },
        { line: 35, text: "밝기에 따라 상태를 판정합니다" },
        { line: 43, text: "2초마다 한 번씩 측정합니다" },
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
addr = 0x29
time.sleep(0.1)

# 센서 활성화 + 게인 설정
i2c.writeto(addr, bytes([0xA0, 0x03]))
i2c.writeto(addr, bytes([0xA1, 0x01]))
time.sleep(0.2)

def read_tsl2591():
    i2c.writeto(addr, bytes([0xB4]))
    ch0_data = i2c.readfrom(addr, 2)
    ch0 = ch0_data[0] | (ch0_data[1] << 8)
    i2c.writeto(addr, bytes([0xB6]))
    ch1_data = i2c.readfrom(addr, 2)
    ch1 = ch1_data[0] | (ch1_data[1] << 8)
    if ch0 == 0:
        return 0
    ratio = ch1 / ch0
    if ratio < 0.5:
        lux = (0.0304 * ch0) - (0.062 * ch0 * (ratio ** 1.4))
    else:
        lux = max(0, 0.0224 * ch0 - 0.031 * ch1)
    return round(lux, 1)

while True:
    lux = read_tsl2591()
    print(f"조도: {lux} lux")
    if lux < 10:
        print("매우 어두움 🌙")
    elif lux < 200:
        print("실내 조명 💡")
    else:
        print("밝음! ☀️")
    time.sleep(2)`,
      annotations: [
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "TSL2591 센서의 주소 0x29" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x29 in found:
    print("\\u2705 TSL2591 디지털 빛 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  TCS34725: {
    id: "TCS34725", name: "색상 센서", model: "TCS34725", label: "RGB 색상 인식",
    icon: "🎨", color: "#ddcc00",
    category: "빛/색상", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "RGB 색상을 인식하는 컬러 센서",
    addressWarning: "이 센서는 I2C 주소 0x29를 사용합니다. TSL2591, TCS34725, VL53L0X는 같은 주소를 사용하므로 동시에 연결할 수 없습니다.",
    grove: true,
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
addr = 0x29  # TCS34725 주소
time.sleep(0.1)

# 센서 활성화: ENABLE 레지스터(0x80)에 AEN+PON 설정
i2c.writeto(addr, bytes([0x80, 0x03]))
# 적분 시간 설정: ATIME(0x81) = 0xEB (약 50ms)
i2c.writeto(addr, bytes([0x81, 0xEB]))
# 게인 설정: CONTROL(0x8F) = 0x01 (4x 게인)
i2c.writeto(addr, bytes([0x8F, 0x01]))
time.sleep(0.1)  # 적분 완료 대기

def read_tcs34725():
    # RGBC 데이터 읽기 (각 16비트, 총 8바이트)
    # Clear(투명), Red, Green, Blue 순서
    i2c.writeto(addr, bytes([0xB4]))  # 0x80|0x20|0x14 = CDATA Low
    data = i2c.readfrom(addr, 8)
    clear = data[0] | (data[1] << 8)
    red   = data[2] | (data[3] << 8)
    green = data[4] | (data[5] << 8)
    blue  = data[6] | (data[7] << 8)
    # 0~255 범위로 정규화
    if clear > 0:
        r = min(255, int(red / clear * 255))
        g = min(255, int(green / clear * 255))
        b = min(255, int(blue / clear * 255))
    else:
        r, g, b = 0, 0, 0
    return r, g, b, clear

while True:
    r, g, b, c = read_tcs34725()
    print(f"R:{r} G:{g} B:{b} (밝기:{c})")
    # 지배적 색상 판별
    if r > g and r > b:
        print("빨간색 계열! 🔴")
    elif g > r and g > b:
        print("초록색 계열! 🟢")
    elif b > r and b > g:
        print("파란색 계열! 🔵")
    else:
        print("혼합색/흰색 ⚪")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 5, text: "0x29는 TCS34725 색상 센서의 주소예요" },
        { line: 8, text: "ENABLE 레지스터에 센서 전원ON + 측정ON 설정" },
        { line: 9, text: "0x03 = AEN(측정 활성화) + PON(전원 켜기)" },
        { line: 10, text: "적분 시간을 약 50ms로 설정합니다 (빛을 모으는 시간)" },
        { line: 12, text: "게인을 4배로 설정합니다 (어두운 환경에서 유리)" },
        { line: 15, text: "RGBC 데이터를 읽는 함수" },
        { line: 17, text: "Clear(전체 밝기), Red, Green, Blue 4채널을 읽습니다" },
        { line: 18, text: "0xB4 = 커맨드비트 + 자동증가 + CDATA 레지스터 시작" },
        { line: 19, text: "8바이트를 한 번에 읽어옵니다 (CRGB 각 2바이트)" },
        { line: 20, text: "Clear(전체 밝기) 값을 16비트로 조합합니다" },
        { line: 21, text: "빨강(Red) 값을 16비트로 조합합니다" },
        { line: 22, text: "초록(Green) 값을 16비트로 조합합니다" },
        { line: 23, text: "파랑(Blue) 값을 16비트로 조합합니다" },
        { line: 25, text: "Clear 값 기준으로 0~255 범위로 정규화합니다" },
        { line: 33, text: "영원히 반복합니다" },
        { line: 34, text: "R, G, B 색상 값과 밝기를 출력합니다" },
        { line: 36, text: "어떤 색이 가장 강한지 판별합니다" },
        { line: 43, text: "1초마다 한 번씩 색상을 측정합니다" },
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
addr = 0x29
time.sleep(0.1)

# 센서 활성화 + 설정
i2c.writeto(addr, bytes([0x80, 0x03]))
i2c.writeto(addr, bytes([0x81, 0xEB]))
i2c.writeto(addr, bytes([0x8F, 0x01]))
time.sleep(0.1)

def read_tcs34725():
    i2c.writeto(addr, bytes([0xB4]))
    data = i2c.readfrom(addr, 8)
    clear = data[0] | (data[1] << 8)
    red   = data[2] | (data[3] << 8)
    green = data[4] | (data[5] << 8)
    blue  = data[6] | (data[7] << 8)
    if clear > 0:
        r = min(255, int(red / clear * 255))
        g = min(255, int(green / clear * 255))
        b = min(255, int(blue / clear * 255))
    else:
        r, g, b = 0, 0, 0
    return r, g, b, clear

while True:
    r, g, b, c = read_tcs34725()
    print(f"R:{r} G:{g} B:{b} (밝기:{c})")
    if r > g and r > b:
        print("빨간색 계열! 🔴")
    elif g > r and g > b:
        print("초록색 계열! 🟢")
    elif b > r and b > g:
        print("파란색 계열! 🔵")
    else:
        print("혼합색/흰색 ⚪")
    time.sleep(1)`,
      annotations: [
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "TCS34725 센서의 주소 0x29" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x29 in found:
    print("\\u2705 TCS34725 색상 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  IR_RECEIVER: {
    id: "IR_RECEIVER", name: "적외선 수신 센서", model: "IR Receiver", label: "리모컨 신호 수신",
    icon: "📡", color: "#cc9900",
    category: "빛/색상", protocol: "디지털", address: null,
    difficulty: 2, lessons: [],
    description: "리모컨 적외선 신호를 수신하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. 리모컨 신호를 받으면 펄스가 발생해요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
ir = Pin(16, Pin.IN)

def read_ir():
    # IR 신호 대기 (LOW가 되면 신호 시작)
    while ir.value() == 1:
        pass
    # 펄스 패턴 기록
    pulses = []
    for i in range(100):
        start = time.ticks_us()
        while ir.value() == 0:
            if time.ticks_diff(time.ticks_us(), start) > 15000:
                return pulses
        mark_start = time.ticks_us()
        while ir.value() == 1:
            if time.ticks_diff(time.ticks_us(), mark_start) > 15000:
                return pulses
        pulses.append(time.ticks_diff(time.ticks_us(), mark_start))
    return pulses

print("리모컨 버튼을 눌러주세요...")
while True:
    pulses = read_ir()
    if len(pulses) > 5:
        print(f"IR 신호 수신! ({len(pulses)}개 펄스)")
        print(f"펄스 패턴: {pulses[:10]}...")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 디지털 입력으로 설정합니다" },
        { line: 5, text: "ir라는 이름으로 적외선 수신 센서를 사용합니다" },
        { line: 7, text: "IR 신호를 읽는 함수를 만듭니다" },
        { line: 9, text: "핀이 LOW가 될 때까지 대기 (신호 시작)" },
        { line: 11, text: "펄스 패턴을 기록하는 리스트" },
        { line: 12, text: "최대 100개의 펄스를 기록합니다" },
        { line: 14, text: "LOW 구간의 시간을 측정합니다" },
        { line: 17, text: "HIGH 구간의 시간을 측정합니다" },
        { line: 20, text: "HIGH 펄스 길이를 기록합니다" },
        { line: 23, text: "리모컨 신호를 기다립니다" },
        { line: 25, text: "IR 신호를 읽습니다" },
        { line: 26, text: "5개 이상 펄스가 있으면 유효한 신호" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. IR 수신 모듈의 OUT 핀을 GP16에 연결하세요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
ir = Pin(16, Pin.IN)

print("리모컨을 IR 센서에 향하고 버튼을 눌러주세요...")
while True:
    if ir.value() == 0:
        print("IR 신호 감지!")
        time.sleep(0.5)
    time.sleep(0.01)`,
      annotations: [
        { line: 1, text: "핀 기능을 가져옵니다" },
        { line: 4, text: "GP16을 디지털 입력으로 설정합니다" },
        { line: 9, text: "IR 신호가 오면 값이 0(LOW)이 됩니다" },
      ],
    },
    initCheck: `# IR 수신 센서 테스트
from machine import Pin
import time
ir = Pin(16, Pin.IN)
print("리모컨을 센서에 향하고 버튼을 눌러주세요!")
for i in range(100):
    if ir.value() == 0:
        print("\\u2705 IR 신호가 감지됐어요!")
        break
    time.sleep(0.05)
else:
    print("5초간 IR 신호 없음. 리모컨을 눌러보세요.")`,
  },

  // ═══════════════════ 거리/움직임 (6종) ═══════════════════
  ULTRASONIC: {
    id: "ULTRASONIC", name: "초음파 거리 센서", model: "Ultrasonic Ranger v2", label: "거리 측정",
    icon: "📏", color: "#00ccff",
    category: "거리/움직임", protocol: "디지털", address: null,
    difficulty: 2, lessons: [8],
    description: "초음파로 거리를 측정하는 센서 (2~400cm)",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "TRIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "ECHO", pico: 22, picoName: "GP17", gp: 17, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. TRIG와 ECHO가 자동 연결돼요.",
      code: `from machine import Pin
import time

# 초음파 센서 핀 설정
trig = Pin(16, Pin.OUT)  # 신호 보내는 핀
echo = Pin(17, Pin.IN)   # 신호 받는 핀

def measure_distance():
    # 초음파 신호 보내기 (10us 펄스)
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()

    # 에코 신호 대기 (타임아웃 30ms)
    start = time.ticks_us()
    end = time.ticks_us()
    t0 = time.ticks_us()
    while echo.value() == 0:
        start = time.ticks_us()
        if time.ticks_diff(start, t0) > 30000:
            return -1  # 타임아웃
    end = start
    while echo.value() == 1:
        end = time.ticks_us()
        if time.ticks_diff(end, start) > 30000:
            return -1  # 타임아웃

    # 거리 계산: 시간(us) × 음속(340m/s) ÷ 2 (왕복)
    duration = time.ticks_diff(end, start)
    distance = duration * 0.0343 / 2
    return round(distance, 1)

while True:
    dist = measure_distance()
    if dist > 0:
        print(f"거리: {dist} cm")
    else:
        print("측정 실패 - 범위 초과")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "초음파 센서의 핀을 설정합니다" },
        { line: 5, text: "GP16을 TRIG(초음파 보내기)용 출력 핀으로 설정" },
        { line: 6, text: "GP17을 ECHO(초음파 받기)용 입력 핀으로 설정" },
        { line: 8, text: "거리를 측정하는 함수를 만듭니다" },
        { line: 10, text: "TRIG 핀을 LOW로 초기화합니다" },
        { line: 12, text: "10마이크로초 동안 HIGH 신호를 보냅니다 (초음파 발사!)" },
        { line: 16, text: "start, end 변수를 초기화합니다 (안전한 코드!)" },
        { line: 19, text: "에코 신호가 돌아올 때까지 기다립니다 (최대 30ms)" },
        { line: 24, text: "에코 신호가 끝날 때까지의 시간을 측정합니다" },
        { line: 30, text: "음속(340m/s)으로 거리를 계산합니다. ÷2는 왕복이니까!" },
        { line: 31, text: "마이크로초 × 0.0343 ÷ 2 = cm 단위 거리" },
        { line: 35, text: "거리를 측정해서 dist에 저장합니다" },
        { line: 36, text: "측정 성공하면 거리를 출력합니다" },
        { line: 38, text: "측정 실패하면 (물체가 너무 멀면) 오류 메시지 출력" },
        { line: 39, text: "0.5초마다 거리를 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "TRIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "ECHO", pico: 22, picoName: "GP17", gp: 17, wire: "#dddddd", label: "흰색" },
      ],
      warning: "ECHO 핀은 5V 신호를 출력할 수 있으니 3.3V Pico에 직접 연결 시 주의! Grove 모듈은 3.3V 호환이에요.",
      note: "점퍼선으로 직접 연결. TRIG와 ECHO 핀을 바꾸지 않도록 주의하세요.",
      code: `from machine import Pin
import time

trig = Pin(16, Pin.OUT)
echo = Pin(17, Pin.IN)

def measure_distance():
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()

    start = time.ticks_us()
    end = time.ticks_us()
    t0 = time.ticks_us()
    while echo.value() == 0:
        start = time.ticks_us()
        if time.ticks_diff(start, t0) > 30000:
            return -1
    end = start
    while echo.value() == 1:
        end = time.ticks_us()
        if time.ticks_diff(end, start) > 30000:
            return -1

    duration = time.ticks_diff(end, start)
    distance = duration * 0.0343 / 2
    return round(distance, 1)

while True:
    dist = measure_distance()
    if dist > 0:
        print(f"거리: {dist} cm")
    else:
        print("측정 실패")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "핀 기능을 가져옵니다" },
        { line: 4, text: "GP16을 TRIG(출력)로 설정" },
        { line: 5, text: "GP17을 ECHO(입력)로 설정" },
        { line: 7, text: "초음파 거리 측정 함수" },
        { line: 12, text: "10us 펄스로 초음파를 발사합니다" },
        { line: 15, text: "start, end 변수를 초기화합니다 (안전한 코드!)" },
        { line: 27, text: "왕복 시간으로 거리를 계산합니다 (음속 × 시간 ÷ 2)" },
      ],
    },
    initCheck: `# 초음파 거리 센서 테스트
from machine import Pin
import time
trig = Pin(16, Pin.OUT)
echo = Pin(17, Pin.IN)
trig.low()
time.sleep_us(2)
trig.high()
time.sleep_us(10)
trig.low()
start = time.ticks_us()
end = time.ticks_us()
t0 = time.ticks_us()
while echo.value() == 0:
    start = time.ticks_us()
    if time.ticks_diff(start, t0) > 30000:
        print("\\u274C 에코 응답 없음. 배선을 확인하세요.")
        break
else:
    end = start
    while echo.value() == 1:
        end = time.ticks_us()
        if time.ticks_diff(end, start) > 30000:
            break
    dist = time.ticks_diff(end, start) * 0.0343 / 2
    print(f"거리: {dist:.1f} cm")
    print("\\u2705 초음파 센서가 동작해요!")`,
  },

  VL53L0X: {
    id: "VL53L0X", name: "ToF 거리 센서", model: "VL53L0X", label: "레이저 거리 측정",
    icon: "🎯", color: "#0099dd",
    category: "거리/움직임", protocol: "I2C", address: "0x29",
    difficulty: 2, lessons: [],
    description: "레이저로 정밀 거리를 측정하는 센서 (~2m)",
    addressWarning: "이 센서는 I2C 주소 0x29를 사용합니다. TSL2591, TCS34725, VL53L0X는 같은 주소를 사용하므로 동시에 연결할 수 없습니다.",
    grove: true,
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
addr = 0x29  # VL53L0X 주소
time.sleep(0.1)

# VL53L0X 초기화
# VHV 설정 로드
i2c.writeto_mem(addr, 0x89, bytes([0x01]))
i2c.writeto_mem(addr, 0x91, bytes([0x3C]))
# SPAD 초기화
i2c.writeto_mem(addr, 0x00, bytes([0x01]))
time.sleep(0.01)
i2c.writeto_mem(addr, 0x00, bytes([0x00]))

def read_distance():
    # 단일 측정 시작
    i2c.writeto_mem(addr, 0x00, bytes([0x01]))
    time.sleep(0.05)
    # 측정 완료 대기
    for _ in range(50):
        result = i2c.readfrom_mem(addr, 0x13, 1)
        if result[0] & 0x07:
            break
        time.sleep(0.01)
    # 거리 데이터 읽기 (16비트, mm 단위)
    data = i2c.readfrom_mem(addr, 0x14 + 10, 2)
    distance = (data[0] << 8) | data[1]
    # 인터럽트 클리어
    i2c.writeto_mem(addr, 0x0B, bytes([0x01]))
    if distance == 0 or distance > 2000:
        return -1  # 범위 초과
    return distance

while True:
    dist = read_distance()
    if dist > 0:
        print(f"거리: {dist} mm ({dist/10:.1f} cm)")
        if dist < 100:
            print("매우 가까움! ⚠️")
        elif dist < 500:
            print("가까움 📏")
        else:
            print("멀리 있음 🔭")
    else:
        print("측정 실패 - 범위 초과")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 5, text: "0x29는 VL53L0X ToF 센서의 주소예요" },
        { line: 8, text: "VL53L0X는 초기화 과정이 필요합니다" },
        { line: 10, text: "VHV(전압 설정)를 로드합니다" },
        { line: 12, text: "SPAD(감지 영역) 초기화" },
        { line: 16, text: "거리를 측정하는 함수" },
        { line: 18, text: "단일 측정 모드를 시작합니다" },
        { line: 20, text: "측정이 완료될 때까지 기다립니다" },
        { line: 26, text: "거리 데이터를 2바이트로 읽습니다 (mm 단위)" },
        { line: 27, text: "2바이트를 16비트 정수로 합칩니다" },
        { line: 29, text: "인터럽트 플래그를 초기화합니다" },
        { line: 30, text: "0이거나 2000mm 초과면 범위 밖으로 판단" },
        { line: 33, text: "영원히 반복합니다" },
        { line: 34, text: "거리를 mm와 cm 단위로 출력합니다" },
        { line: 36, text: "100mm 미만이면 매우 가까움 경고" },
        { line: 44, text: "0.5초마다 거리를 측정합니다" },
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
addr = 0x29
time.sleep(0.1)

# VL53L0X 초기화
i2c.writeto_mem(addr, 0x89, bytes([0x01]))
i2c.writeto_mem(addr, 0x91, bytes([0x3C]))
i2c.writeto_mem(addr, 0x00, bytes([0x01]))
time.sleep(0.01)
i2c.writeto_mem(addr, 0x00, bytes([0x00]))

def read_distance():
    i2c.writeto_mem(addr, 0x00, bytes([0x01]))
    time.sleep(0.05)
    for _ in range(50):
        result = i2c.readfrom_mem(addr, 0x13, 1)
        if result[0] & 0x07:
            break
        time.sleep(0.01)
    data = i2c.readfrom_mem(addr, 0x14 + 10, 2)
    distance = (data[0] << 8) | data[1]
    i2c.writeto_mem(addr, 0x0B, bytes([0x01]))
    if distance == 0 or distance > 2000:
        return -1
    return distance

while True:
    dist = read_distance()
    if dist > 0:
        print(f"거리: {dist} mm ({dist/10:.1f} cm)")
    else:
        print("측정 실패 - 범위 초과")
    time.sleep(0.5)`,
      annotations: [
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "VL53L0X 센서의 주소 0x29" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x29 in found:
    print("\\u2705 VL53L0X ToF 거리 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  PIR: {
    id: "PIR", name: "PIR 동작 센서", model: "PIR Motion Sensor", label: "동작 감지",
    icon: "🚶", color: "#00aacc",
    category: "거리/움직임", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "사람의 움직임을 감지하는 적외선 센서",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. 사람이 움직이면 1이 돼요. 처음 1분간 워밍업 필요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
pir = Pin(16, Pin.IN)

print("PIR 센서 워밍업 중... (약 30초)")
time.sleep(30)
print("준비 완료!")

while True:
    # 동작 감지 (1=감지됨, 0=없음)
    if pir.value() == 1:
        print("동작 감지! 누군가 움직였어요!")
    else:
        print("감지 없음 - 조용해요")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 디지털 입력으로 설정합니다" },
        { line: 5, text: "pir라는 이름으로 동작감지 센서를 사용합니다" },
        { line: 7, text: "PIR 센서는 처음에 워밍업 시간이 필요해요" },
        { line: 8, text: "약 30초 기다리면 센서가 안정돼요" },
        { line: 11, text: "영원히 반복합니다" },
        { line: 13, text: "value()가 1이면 사람의 움직임이 감지된 것" },
        { line: 14, text: "움직임 감지 메시지를 출력합니다" },
        { line: 16, text: "움직임이 없으면 조용한 상태" },
        { line: 17, text: "0.5초마다 동작을 감지합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. PIR 센서는 처음 30초~1분 워밍업이 필요해요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
pir = Pin(16, Pin.IN)

print("워밍업 중...")
time.sleep(30)

while True:
    if pir.value() == 1:
        print("동작 감지!")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "핀 기능을 가져옵니다" },
        { line: 4, text: "GP16을 디지털 입력으로 설정합니다" },
        { line: 7, text: "PIR 센서 워밍업 대기" },
        { line: 11, text: "값이 1이면 사람 움직임 감지" },
      ],
    },
    initCheck: `# PIR 동작감지 센서 테스트
from machine import Pin
import time
pir = Pin(16, Pin.IN)
print("PIR 센서 워밍업 중... (10초)")
time.sleep(10)
print("손을 흔들어보세요!")
for i in range(50):
    if pir.value() == 1:
        print("\\u2705 동작이 감지됐어요!")
        break
    time.sleep(0.1)
else:
    print("5초간 감지 없음. 더 기다리거나 센서 앞에서 움직여보세요.")`,
  },

  ADXL345: {
    id: "ADXL345", name: "3축 가속도 센서", model: "ADXL345", label: "가속도/기울기 측정",
    icon: "📐", color: "#0088bb",
    category: "거리/움직임", protocol: "I2C", address: "0x53",
    difficulty: 3, lessons: [],
    description: "3축 가속도와 기울기를 측정하는 센서",
    grove: true,
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
import struct

# I2C 통신 설정 (Grove Shield I2C1 포트)
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x53  # ADXL345 주소
time.sleep(0.1)

# 측정 모드 활성화: POWER_CTL(0x2D) 레지스터에 0x08 쓰기
i2c.writeto_mem(addr, 0x2D, bytes([0x08]))
# 데이터 범위 설정: DATA_FORMAT(0x31) = +-2g, 10비트
i2c.writeto_mem(addr, 0x31, bytes([0x00]))
time.sleep(0.01)

def read_adxl345():
    # X, Y, Z 가속도 데이터 읽기 (6바이트, 0x32~0x37)
    data = i2c.readfrom_mem(addr, 0x32, 6)
    # 리틀엔디안 부호 있는 16비트로 변환
    x = struct.unpack('<h', data[0:2])[0]
    y = struct.unpack('<h', data[2:4])[0]
    z = struct.unpack('<h', data[4:6])[0]
    # +-2g 범위에서 g 단위로 변환 (256 LSB/g)
    x_g = x / 256.0
    y_g = y / 256.0
    z_g = z / 256.0
    return round(x_g, 2), round(y_g, 2), round(z_g, 2)

while True:
    x, y, z = read_adxl345()
    print(f"X: {x}g, Y: {y}g, Z: {z}g")
    # 기울기 판정
    if abs(x) > 0.5:
        print("좌우로 기울어짐!" if x > 0 else "반대로 기울어짐!")
    if abs(y) > 0.5:
        print("앞뒤로 기울어짐!")
    if z > 0.8:
        print("수평 상태 ⬜")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 3, text: "바이트 데이터를 숫자로 변환하는 struct 모듈" },
        { line: 5, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 6, text: "0x53은 ADXL345 가속도 센서의 주소예요" },
        { line: 9, text: "POWER_CTL 레지스터에 0x08을 써서 측정 모드를 켭니다" },
        { line: 10, text: "0x08 = Measure 비트를 1로 설정 (측정 시작!)" },
        { line: 11, text: "측정 범위를 +-2g로 설정합니다" },
        { line: 14, text: "가속도를 읽는 함수를 만듭니다" },
        { line: 16, text: "0x32 레지스터부터 6바이트(X,Y,Z 각 2바이트) 읽기" },
        { line: 18, text: "바이트를 부호 있는 정수로 변환합니다 (리틀엔디안)" },
        { line: 22, text: "+-2g 범위에서는 256이 1g에 해당해요" },
        { line: 23, text: "256으로 나누면 g(중력가속도) 단위가 됩니다" },
        { line: 27, text: "영원히 반복합니다" },
        { line: 28, text: "X, Y, Z 축 가속도를 g 단위로 출력" },
        { line: 30, text: "X축이 0.5g 이상이면 좌우 기울기 감지" },
        { line: 32, text: "Y축이 0.5g 이상이면 앞뒤 기울기 감지" },
        { line: 34, text: "Z축이 0.8g 이상이면 거의 수평 상태" },
        { line: 36, text: "0.5초마다 가속도를 측정합니다" },
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
import struct

# 직접 연결 — 내부 풀업 활성화
sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
addr = 0x53
time.sleep(0.1)

# 측정 모드 활성화
i2c.writeto_mem(addr, 0x2D, bytes([0x08]))
i2c.writeto_mem(addr, 0x31, bytes([0x00]))
time.sleep(0.01)

def read_adxl345():
    data = i2c.readfrom_mem(addr, 0x32, 6)
    x = struct.unpack('<h', data[0:2])[0]
    y = struct.unpack('<h', data[2:4])[0]
    z = struct.unpack('<h', data[4:6])[0]
    x_g = x / 256.0
    y_g = y / 256.0
    z_g = z / 256.0
    return round(x_g, 2), round(y_g, 2), round(z_g, 2)

while True:
    x, y, z = read_adxl345()
    print(f"X: {x}g, Y: {y}g, Z: {z}g")
    if abs(x) > 0.5:
        print("좌우 기울어짐!")
    if abs(y) > 0.5:
        print("앞뒤 기울어짐!")
    if z > 0.8:
        print("수평 상태 ⬜")
    time.sleep(0.5)`,
      annotations: [
        { line: 5, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 6, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 8, text: "I2C 1번 버스로 통신 설정" },
        { line: 9, text: "ADXL345 센서의 주소 0x53" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x53 in found:
    print("\\u2705 ADXL345 3축 가속도 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  MPU6050: {
    id: "MPU6050", name: "자이로+가속도 센서", model: "MPU6050", label: "6축 모션 센싱",
    icon: "🌐", color: "#0077aa",
    category: "거리/움직임", protocol: "I2C", address: "0x68",
    difficulty: 3, lessons: [],
    description: "6축 모션 센싱 (가속도 3축 + 자이로 3축)",
    grove: true,
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
import struct

# I2C 통신 설정 (Grove Shield I2C1 포트)
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
addr = 0x68  # MPU6050 주소
time.sleep(0.1)

# 슬립 모드 해제: PWR_MGMT_1(0x6B) = 0x00
i2c.writeto_mem(addr, 0x6B, bytes([0x00]))
time.sleep(0.1)

def read_mpu6050():
    # 가속도 데이터 읽기 (0x3B~0x40, 6바이트)
    accel_data = i2c.readfrom_mem(addr, 0x3B, 6)
    ax = struct.unpack('>h', accel_data[0:2])[0] / 16384.0
    ay = struct.unpack('>h', accel_data[2:4])[0] / 16384.0
    az = struct.unpack('>h', accel_data[4:6])[0] / 16384.0
    # 자이로 데이터 읽기 (0x43~0x48, 6바이트)
    gyro_data = i2c.readfrom_mem(addr, 0x43, 6)
    gx = struct.unpack('>h', gyro_data[0:2])[0] / 131.0
    gy = struct.unpack('>h', gyro_data[2:4])[0] / 131.0
    gz = struct.unpack('>h', gyro_data[4:6])[0] / 131.0
    return (round(ax, 2), round(ay, 2), round(az, 2),
            round(gx, 1), round(gy, 1), round(gz, 1))

while True:
    ax, ay, az, gx, gy, gz = read_mpu6050()
    print(f"가속도 X:{ax}g Y:{ay}g Z:{az}g")
    print(f"자이로 X:{gx}°/s Y:{gy}°/s Z:{gz}°/s")
    # 움직임 감지
    if abs(gx) > 50 or abs(gy) > 50 or abs(gz) > 50:
        print("빠르게 회전 중! 🌀")
    elif abs(ax) > 1.5 or abs(ay) > 1.5:
        print("흔들림 감지! 📳")
    else:
        print("안정 상태 ✅")
    print("---")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 3, text: "바이트 데이터를 숫자로 변환하는 struct 모듈" },
        { line: 5, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 6, text: "0x68은 MPU6050 센서의 주소예요" },
        { line: 9, text: "센서가 절전(슬립) 모드로 시작하므로 깨워야 해요" },
        { line: 10, text: "PWR_MGMT_1에 0x00을 쓰면 슬립 모드가 해제됩니다" },
        { line: 13, text: "가속도와 자이로 값을 읽는 함수" },
        { line: 15, text: "0x3B 레지스터부터 6바이트 = 가속도 X, Y, Z" },
        { line: 16, text: "빅엔디안 16비트 → +-2g 범위 (16384 LSB/g)" },
        { line: 17, text: "16384로 나누면 g(중력가속도) 단위가 됩니다" },
        { line: 20, text: "0x43 레지스터부터 6바이트 = 자이로 X, Y, Z" },
        { line: 21, text: "+-250°/s 범위 (131 LSB/°/s)" },
        { line: 22, text: "131로 나누면 °/s(초당 각도) 단위가 됩니다" },
        { line: 27, text: "영원히 반복합니다" },
        { line: 28, text: "가속도와 자이로 값을 읽습니다" },
        { line: 29, text: "가속도를 g 단위로 출력합니다" },
        { line: 30, text: "자이로를 °/s 단위로 출력합니다" },
        { line: 32, text: "자이로 값이 크면 빠른 회전 감지" },
        { line: 34, text: "가속도가 크면 흔들림 감지" },
        { line: 38, text: "0.5초마다 측정합니다" },
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
import struct

# 직접 연결 — 내부 풀업 활성화
sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=100000)
addr = 0x68
time.sleep(0.1)

# 슬립 모드 해제
i2c.writeto_mem(addr, 0x6B, bytes([0x00]))
time.sleep(0.1)

def read_mpu6050():
    accel_data = i2c.readfrom_mem(addr, 0x3B, 6)
    ax = struct.unpack('>h', accel_data[0:2])[0] / 16384.0
    ay = struct.unpack('>h', accel_data[2:4])[0] / 16384.0
    az = struct.unpack('>h', accel_data[4:6])[0] / 16384.0
    gyro_data = i2c.readfrom_mem(addr, 0x43, 6)
    gx = struct.unpack('>h', gyro_data[0:2])[0] / 131.0
    gy = struct.unpack('>h', gyro_data[2:4])[0] / 131.0
    gz = struct.unpack('>h', gyro_data[4:6])[0] / 131.0
    return (round(ax, 2), round(ay, 2), round(az, 2),
            round(gx, 1), round(gy, 1), round(gz, 1))

while True:
    ax, ay, az, gx, gy, gz = read_mpu6050()
    print(f"가속도 X:{ax}g Y:{ay}g Z:{az}g")
    print(f"자이로 X:{gx}°/s Y:{gy}°/s Z:{gz}°/s")
    if abs(gx) > 50 or abs(gy) > 50 or abs(gz) > 50:
        print("빠르게 회전 중! 🌀")
    elif abs(ax) > 1.5 or abs(ay) > 1.5:
        print("흔들림 감지! 📳")
    else:
        print("안정 상태 ✅")
    print("---")
    time.sleep(0.5)`,
      annotations: [
        { line: 5, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 6, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 8, text: "I2C 1번 버스로 통신 설정" },
        { line: 9, text: "MPU6050 센서의 주소 0x68" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x68 in found:
    print("\\u2705 MPU6050 6축 자세 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  GPS: {
    id: "GPS", name: "GPS 센서", model: "NEO-6M", label: "위치/속도 측정",
    icon: "🛰️", color: "#006699",
    category: "거리/움직임", protocol: "UART", address: null,
    difficulty: 3, lessons: [],
    description: "GPS 위성으로 위치와 속도를 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "UART", type: "UART", position: "right-middle", color: "#ff88ff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "TX", pico: 7, picoName: "GP5", gp: 5, wire: "#ffdd00", label: "노랑" },
        { sensor: "RX", pico: 6, picoName: "GP4", gp: 4, wire: "#dddddd", label: "흰색" },
      ],
      warning: "GPS는 실외에서만 위성 수신이 가능해요! 실내에서는 위치 데이터가 안 나올 수 있어요.",
      note: "Grove Shield UART 포트에 꽂으세요. GPS의 TX→Pico RX(GP5), GPS의 RX→Pico TX(GP4).",
      code: `from machine import UART, Pin
import time

# UART 통신 설정 (GPS 모듈)
uart = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))

def parse_gprmc(line):
    # $GPRMC 문장 파싱 (위치, 속도, 시간)
    parts = line.split(',')
    if len(parts) < 10 or parts[2] != 'A':
        return None  # 유효하지 않은 데이터
    # 시간 (UTC)
    t = parts[1]
    time_str = f"{t[0:2]}:{t[2:4]}:{t[4:6]} UTC"
    # 위도
    lat = float(parts[3][:2]) + float(parts[3][2:]) / 60
    if parts[4] == 'S': lat = -lat
    # 경도
    lon = float(parts[5][:3]) + float(parts[5][3:]) / 60
    if parts[6] == 'W': lon = -lon
    # 속도 (노트 → km/h)
    speed = float(parts[7]) * 1.852 if parts[7] else 0
    return time_str, lat, lon, round(speed, 1)

print("GPS 위성 수신 대기 중... (실외에서 사용하세요)")

while True:
    if uart.any():
        line = uart.readline()
        if line:
            try:
                decoded = line.decode('ascii').strip()
                if decoded.startswith('$GPRMC'):
                    result = parse_gprmc(decoded)
                    if result:
                        t, lat, lon, spd = result
                        print(f"시간: {t}")
                        print(f"위도: {lat:.6f}, 경도: {lon:.6f}")
                        print(f"속도: {spd} km/h")
                        print("---")
            except:
                pass
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "UART 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "UART 1번 버스를 9600bps 속도로 설정합니다" },
        { line: 5, text: "GP4(TX=보내기), GP5(RX=받기) 핀을 사용합니다" },
        { line: 7, text: "GPS NMEA $GPRMC 문장을 분석하는 함수" },
        { line: 9, text: "쉼표로 구분해서 각 필드를 분리합니다" },
        { line: 10, text: "A=유효, V=무효. 유효한 데이터만 처리합니다" },
        { line: 13, text: "UTC 시간을 읽기 쉬운 형식으로 변환합니다" },
        { line: 15, text: "위도를 도(degree) 단위로 변환합니다" },
        { line: 17, text: "경도를 도(degree) 단위로 변환합니다" },
        { line: 19, text: "속도를 노트에서 km/h로 변환합니다" },
        { line: 22, text: "실외에서 사용해야 위성 신호를 받을 수 있어요" },
        { line: 25, text: "UART에 데이터가 있는지 확인합니다" },
        { line: 26, text: "한 줄씩 읽어옵니다" },
        { line: 29, text: "$GPRMC 문장만 처리합니다 (위치+속도+시간)" },
        { line: 34, text: "위도, 경도, 속도를 화면에 출력합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "TX", pico: 7, picoName: "GP5", gp: 5, wire: "#ffdd00", label: "노랑" },
        { sensor: "RX", pico: 6, picoName: "GP4", gp: 4, wire: "#dddddd", label: "흰색" },
      ],
      warning: "GPS TX → Pico RX(GP5), GPS RX → Pico TX(GP4)로 교차 연결하세요!",
      note: "점퍼선으로 직접 연결. TX/RX를 교차해야 해요. 실외 사용 필수.",
      code: `from machine import UART, Pin
import time

# UART 통신 설정
uart = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))

print("GPS 수신 대기 중...")
while True:
    if uart.any():
        line = uart.readline()
        if line:
            try:
                text = line.decode('ascii').strip()
                if text.startswith('$GPRMC'):
                    print(text)
            except:
                pass
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "UART 통신과 핀 기능을 가져옵니다" },
        { line: 4, text: "UART 1번, 9600bps, GP4(TX), GP5(RX)" },
        { line: 8, text: "데이터가 있으면 읽어옵니다" },
        { line: 13, text: "$GPRMC 문장을 출력합니다" },
      ],
    },
    initCheck: `# GPS 센서 연결 테스트
from machine import UART, Pin
import time
uart = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))
print("GPS 데이터 수신 대기 중... (5초)")
found = False
for i in range(50):
    if uart.any():
        line = uart.readline()
        if line:
            print("\\u2705 GPS 데이터를 수신하고 있어요!")
            print(f"   수신: {line[:50]}")
            found = True
            break
    time.sleep(0.1)
if not found:
    print("\\u274C GPS 데이터가 없어요. 배선 확인 + 실외에서 시도하세요.")`,
  },

  // ═══════════════════ 신체 (3종) ═══════════════════
  PULSE: {
    id: "PULSE", name: "심박 센서", model: "Pulse Sensor", label: "심박수 측정",
    icon: "💓", color: "#ff88ff",
    category: "신체", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [7],
    description: "손가락 끝에서 심박수를 측정하는 센서",
    grove: true,
    shield: {
      grovePort: { name: "A0", type: "아날로그", position: "left-top", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A0 포트에 꽂으세요. 손가락을 센서 위에 올려서 심박을 측정해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
pulse = ADC(Pin(26))

# 심박 감지 변수
threshold = 35000  # 심박 감지 기준값
beat_detected = False
last_beat = time.ticks_ms()
bpm = 0

while True:
    # 맥박 센서 값 읽기
    raw = pulse.read_u16()
    now = time.ticks_ms()

    # 심박 피크 감지
    if raw > threshold and not beat_detected:
        beat_detected = True
        interval = time.ticks_diff(now, last_beat)
        if 300 < interval < 2000:  # 30~200 BPM 범위
            bpm = 60000 // interval
        last_beat = now
    elif raw < threshold - 5000:
        beat_detected = False

    print(f"맥박값: {raw}, BPM: {bpm}")
    time.sleep(0.02)  # 50Hz 샘플링`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP26번 핀을 아날로그 입력으로 설정합니다 (ADC0)" },
        { line: 5, text: "pulse라는 이름으로 맥박 센서를 사용합니다" },
        { line: 7, text: "심박을 감지하기 위한 변수들을 설정합니다" },
        { line: 8, text: "이 값보다 크면 심박 피크로 판정합니다" },
        { line: 13, text: "영원히 반복합니다" },
        { line: 15, text: "맥박 센서의 아날로그 값을 읽습니다" },
        { line: 18, text: "값이 기준값보다 크면 심박 피크입니다" },
        { line: 20, text: "이전 심박과의 시간 간격을 계산합니다" },
        { line: 21, text: "간격이 적절한 범위면 BPM을 계산합니다" },
        { line: 22, text: "60초(60000ms)를 간격으로 나누면 분당 심박수(BPM)" },
        { line: 25, text: "값이 내려가면 피크 감지를 초기화합니다" },
        { line: 27, text: "맥박값과 BPM을 화면에 출력합니다" },
        { line: 28, text: "0.02초(50Hz)마다 측정합니다 (정확한 심박 감지를 위해)" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
pulse = ADC(Pin(26))

threshold = 35000
beat_detected = False
last_beat = time.ticks_ms()
bpm = 0

while True:
    raw = pulse.read_u16()
    now = time.ticks_ms()
    if raw > threshold and not beat_detected:
        beat_detected = True
        interval = time.ticks_diff(now, last_beat)
        if 300 < interval < 2000:
            bpm = 60000 // interval
        last_beat = now
    elif raw < threshold - 5000:
        beat_detected = False
    print(f"BPM: {bpm} (원시값: {raw})")
    time.sleep(0.02)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP26을 ADC(아날로그 입력)로 설정합니다" },
        { line: 6, text: "심박 감지 기준값" },
        { line: 13, text: "아날로그 값을 읽고 심박 피크를 감지합니다" },
        { line: 23, text: "BPM과 원시값을 출력합니다" },
      ],
    },
    initCheck: `# 맥박 센서 테스트
from machine import ADC, Pin
p = ADC(Pin(26))
val = p.read_u16()
print(f"맥박 센서 값: {val}")
if val > 0:
    print("\\u2705 맥박 센서가 동작해요! 손가락을 올려보세요.")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  GSR: {
    id: "GSR", name: "GSR 피부전도 센서", model: "GSR Sensor", label: "스트레스 측정",
    icon: "🖐️", color: "#dd66dd",
    category: "신체", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "피부 전기 전도도를 측정하는 센서 (스트레스 지표)",
    grove: true,
    shield: {
      grovePort: { name: "A2", type: "아날로그", position: "left-middle", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A2 포트에 꽂으세요. 두 손가락에 전극을 끼워서 측정해요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
gsr_sensor = ADC(Pin(27))

while True:
    # GSR 센서 값 읽기 (0~65535)
    raw = gsr_sensor.read_u16()
    # 전압으로 변환
    voltage = raw / 65535 * 3.3
    # 저항값 계산 (옴)
    if voltage > 0:
        resistance = (3.3 - voltage) / voltage * 10000
    else:
        resistance = 0
    # 스트레스 수준 판정
    if raw > 40000:
        stress = "편안한 상태"
    elif raw > 20000:
        stress = "보통 상태"
    else:
        stress = "긴장/스트레스 상태"
    print(f"GSR: {raw}, 전압: {voltage:.2f}V - {stress}")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP27번 핀을 아날로그 입력으로 설정합니다 (ADC1)" },
        { line: 5, text: "gsr_sensor라는 이름으로 GSR 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "GSR 센서의 아날로그 값을 읽습니다 (0~65535)" },
        { line: 11, text: "ADC 값을 전압으로 변환합니다" },
        { line: 13, text: "전압으로 피부 저항값을 계산합니다" },
        { line: 18, text: "GSR 값으로 스트레스 수준을 판정합니다" },
        { line: 19, text: "값이 크면 피부 전도도가 낮아 편안한 상태" },
        { line: 21, text: "중간 값이면 보통 상태" },
        { line: 23, text: "값이 작으면 땀이 나서 전도도가 높은 긴장 상태" },
        { line: 24, text: "GSR 값과 스트레스 수준을 출력합니다" },
        { line: 25, text: "0.5초마다 한 번씩 측정합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 32, picoName: "GP27", gp: 27, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP27번 핀을 아날로그 입력(ADC)으로 설정
gsr_sensor = ADC(Pin(27))

while True:
    raw = gsr_sensor.read_u16()
    voltage = raw / 65535 * 3.3
    print(f"GSR: {raw} (전압: {voltage:.2f}V)")
    time.sleep(0.5)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP27을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "전압으로 변환합니다" },
      ],
    },
    initCheck: `# GSR 센서 테스트
from machine import ADC, Pin
gsr = ADC(Pin(27))
val = gsr.read_u16()
print(f"GSR 센서 값: {val}")
if val > 0:
    print("\\u2705 GSR 센서가 동작해요! 손가락에 전극을 끼워보세요.")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  MLX90614: {
    id: "MLX90614", name: "비접촉 체온 센서", model: "MLX90614", label: "비접촉 온도 측정",
    icon: "🌡️", color: "#cc44cc",
    category: "신체", protocol: "I2C", address: "0x5A",
    difficulty: 2, lessons: [],
    description: "비접촉으로 물체/체온을 측정하는 적외선 온도 센서",
    grove: true,
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
addr = 0x5A  # MLX90614 주소
time.sleep(0.1)

def read_temp(reg):
    # 레지스터에서 온도 데이터 읽기 (2바이트 + PEC)
    data = i2c.readfrom_mem(addr, reg, 3)
    # 16비트 값으로 조합 (리틀엔디안)
    raw = data[0] | (data[1] << 8)
    # 켈빈 → 섭씨 변환 (0.02K 단위)
    temp = raw * 0.02 - 273.15
    return round(temp, 1)

def read_mlx90614():
    # 주변(센서 자체) 온도: 레지스터 0x06
    ambient = read_temp(0x06)
    # 물체(대상) 온도: 레지스터 0x07
    obj_temp = read_temp(0x07)
    return ambient, obj_temp

while True:
    ambient, obj = read_mlx90614()
    print(f"주변 온도: {ambient}°C")
    print(f"대상 온도: {obj}°C")
    # 체온 범위 판정 (대상 온도 기준)
    if 36.0 <= obj <= 37.5:
        print("정상 체온 범위 ✅")
    elif obj > 37.5:
        print("체온이 높아요! 🔥")
    elif obj > 30:
        print("체온보다 낮은 온도")
    else:
        print("일반 물체 온도")
    print("---")
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "I2C 1번 버스, GP6(SDA), GP7(SCL), 속도 100kHz" },
        { line: 5, text: "0x5A는 MLX90614 적외선 온도 센서의 주소예요" },
        { line: 8, text: "특정 레지스터에서 온도를 읽는 함수" },
        { line: 10, text: "레지스터에서 3바이트 읽기 (데이터 2바이트 + 체크섬)" },
        { line: 12, text: "2바이트를 16비트 정수로 합칩니다" },
        { line: 14, text: "센서는 켈빈 단위로 알려주므로 섭씨로 변환합니다" },
        { line: 15, text: "0.02를 곱하고 273.15를 빼면 섭씨 온도가 됩니다" },
        { line: 18, text: "주변 온도와 대상 온도를 함께 읽는 함수" },
        { line: 20, text: "0x06 레지스터 = 센서 주변(공기) 온도" },
        { line: 22, text: "0x07 레지스터 = 적외선으로 측정한 대상 온도" },
        { line: 25, text: "영원히 반복합니다" },
        { line: 26, text: "주변 온도와 대상 온도를 읽습니다" },
        { line: 27, text: "주변(공기) 온도를 출력합니다" },
        { line: 28, text: "대상(물체/체온) 온도를 출력합니다" },
        { line: 30, text: "36~37.5°C 사이면 정상 체온" },
        { line: 32, text: "37.5°C 초과면 체온이 높다고 알림" },
        { line: 38, text: "1초마다 한 번씩 측정합니다" },
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
addr = 0x5A
time.sleep(0.1)

def read_temp(reg):
    data = i2c.readfrom_mem(addr, reg, 3)
    raw = data[0] | (data[1] << 8)
    temp = raw * 0.02 - 273.15
    return round(temp, 1)

def read_mlx90614():
    ambient = read_temp(0x06)
    obj_temp = read_temp(0x07)
    return ambient, obj_temp

while True:
    ambient, obj = read_mlx90614()
    print(f"주변 온도: {ambient}°C")
    print(f"대상 온도: {obj}°C")
    if 36.0 <= obj <= 37.5:
        print("정상 체온 범위 ✅")
    elif obj > 37.5:
        print("체온이 높아요! 🔥")
    else:
        print("일반 물체 온도")
    print("---")
    time.sleep(1)`,
      annotations: [
        { line: 4, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 5, text: "GP6을 SDA(데이터)로 설정 + 풀업 저항 ON" },
        { line: 6, text: "GP7을 SCL(클록)로 설정 + 풀업 저항 ON" },
        { line: 7, text: "I2C 1번 버스로 통신 설정" },
        { line: 8, text: "MLX90614 센서의 주소 0x5A" },
      ],
    },
    initCheck: `# 센서 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x5A in found:
    print("\\u2705 MLX90614 적외선 온도 센서를 찾았어요!")
else:
    print("\\u274C 센서를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  // ═══════════════════ 입력 (4종) ═══════════════════
  BUTTON: {
    id: "BUTTON", name: "버튼", model: "Button", label: "푸시 버튼",
    icon: "🔘", color: "#ff8844",
    category: "입력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [], recommended: true,
    description: "누르면 신호가 가는 스위치예요. LED와 함께 쓰면 재밌어요!",
    grove: true,
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
    initCheck: `# 버튼 테스트
from machine import Pin
import time
btn = Pin(8, Pin.IN, Pin.PULL_UP)
print("버튼을 눌러보세요!")
for i in range(50):
    if btn.value() == 0:
        print("\\u2705 버튼이 눌렸어요!")
        break
    time.sleep(0.1)
else:
    print("5초간 버튼 입력 없음. 버튼을 눌러보세요.")`,
  },

  ROTARY: {
    id: "ROTARY", name: "로터리 앵글 센서", model: "Rotary Angle Sensor", label: "회전 입력",
    icon: "🎛️", color: "#ee7733",
    category: "입력", protocol: "아날로그", address: null,
    difficulty: 1, lessons: [],
    description: "회전 각도를 입력하는 가변저항 센서",
    grove: true,
    shield: {
      grovePort: { name: "A0", type: "아날로그", position: "left-top", color: "#ffaa00" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "Grove Shield 아날로그 A0 포트에 꽂으세요. 손잡이를 돌려서 값을 변경해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
rotary = ADC(Pin(26))

while True:
    # 로터리 센서 값 읽기 (0~65535)
    raw = rotary.read_u16()
    # 각도로 변환 (0~300도)
    angle = round(raw / 65535 * 300, 1)
    # 퍼센트로 변환
    percent = round(raw / 65535 * 100, 1)
    print(f"각도: {angle}도, 값: {percent}% (원시값: {raw})")
    time.sleep(0.2)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP26번 핀을 아날로그 입력으로 설정합니다 (ADC0)" },
        { line: 5, text: "rotary라는 이름으로 로터리 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "로터리 센서의 아날로그 값을 읽습니다 (0~65535)" },
        { line: 11, text: "Grove 로터리는 최대 300도까지 돌아가요" },
        { line: 13, text: "퍼센트로도 변환합니다 (0~100%)" },
        { line: 14, text: "각도, 퍼센트, 원시값을 출력합니다" },
        { line: 15, text: "0.2초마다 값을 읽습니다 (손잡이 반응을 빠르게)" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. ADC 핀은 GP26, GP27, GP28만 사용 가능해요.",
      code: `from machine import ADC, Pin
import time

# GP26번 핀을 아날로그 입력(ADC)으로 설정
rotary = ADC(Pin(26))

while True:
    raw = rotary.read_u16()
    angle = round(raw / 65535 * 300, 1)
    print(f"각도: {angle}도 (원시값: {raw})")
    time.sleep(0.2)`,
      annotations: [
        { line: 1, text: "ADC와 핀 기능을 가져옵니다" },
        { line: 4, text: "GP26을 ADC(아날로그 입력)로 설정합니다" },
        { line: 8, text: "16비트 아날로그 값을 읽습니다 (0~65535)" },
        { line: 9, text: "300도 범위로 변환합니다" },
      ],
    },
    initCheck: `# 로터리 센서 테스트
from machine import ADC, Pin
r = ADC(Pin(26))
val = r.read_u16()
print(f"로터리 센서 값: {val}")
if val > 0:
    print("\\u2705 로터리 센서가 동작해요! 손잡이를 돌려보세요.")
else:
    print("\\u274C 센서 값이 0이에요. 배선을 확인하세요.")`,
  },

  JOYSTICK: {
    id: "JOYSTICK", name: "조이스틱", model: "PS2 조이스틱 모듈", label: "2축 방향 입력",
    icon: "🕹️", color: "#dd6622",
    category: "입력", protocol: "아날로그", address: null,
    difficulty: 2, lessons: [],
    description: "X/Y 2축 방향 입력 + 버튼이 있는 PS2 조이스틱 모듈",
    grove: false,
    direct: {
      pins: [
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "+5V", pico: 40, picoName: "VBUS(5V)", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "VRx", pico: 31, picoName: "GP26", gp: 26, wire: "#ffdd00", label: "노랑" },
        { sensor: "VRy", pico: 32, picoName: "GP27", gp: 27, wire: "#00cc66", label: "초록" },
        { sensor: "SW", pico: 24, picoName: "GP18", gp: 18, wire: "#dddddd", label: "흰색" },
      ],
      warning: "PS2 조이스틱은 5V 전원이 필요해요! Pico의 VBUS(5V) 핀에 연결하세요. VRx, VRy는 각각 별도의 ADC 핀에 연결해야 해요.",
      note: "VRx→GP26, VRy→GP27, SW(버튼)→GP18에 점퍼선으로 연결하세요.",
      code: `from machine import ADC, Pin
import time

# VRx: GP26(ADC0), VRy: GP27(ADC1), SW: GP18
joy_x = ADC(Pin(26))   # VRx 핀
joy_y = ADC(Pin(27))   # VRy 핀
button = Pin(18, Pin.IN, Pin.PULL_UP)  # SW 버튼 (누르면 0)

while True:
    # 조이스틱 X, Y 값 읽기
    x = joy_x.read_u16()
    y = joy_y.read_u16()
    btn = button.value()  # 0=눌림, 1=안 눌림
    # 중앙값(약 32768)을 기준으로 방향 판정
    if x < 15000:
        dir_x = "왼쪽"
    elif x > 50000:
        dir_x = "오른쪽"
    else:
        dir_x = "중앙"
    if y < 15000:
        dir_y = "아래"
    elif y > 50000:
        dir_y = "위"
    else:
        dir_y = "중앙"
    pressed = "눌림!" if btn == 0 else ""
    print(f"X: {x} ({dir_x}), Y: {y} ({dir_y}) {pressed}")
    time.sleep(0.2)`,
      annotations: [
        { line: 1, text: "ADC(아날로그-디지털 변환)와 핀 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "VRx는 GP26(ADC0), VRy는 GP27(ADC1)을 사용합니다" },
        { line: 5, text: "VRx(X축) 아날로그 입력을 설정합니다" },
        { line: 6, text: "VRy(Y축) 아날로그 입력을 설정합니다" },
        { line: 7, text: "SW(버튼)는 디지털 입력, 내부 풀업 저항 사용" },
        { line: 9, text: "영원히 반복합니다" },
        { line: 11, text: "VRx 아날로그 값을 읽습니다 (0~65535)" },
        { line: 12, text: "VRy 아날로그 값을 읽습니다 (0~65535)" },
        { line: 13, text: "버튼 상태를 읽습니다 (0=눌림, 1=안 눌림)" },
        { line: 15, text: "중앙값(약 32768) 기준으로 방향을 판정합니다" },
        { line: 28, text: "버튼이 눌렸으면 '눌림!' 표시" },
        { line: 29, text: "X, Y 값과 방향, 버튼 상태를 출력합니다" },
        { line: 30, text: "0.2초마다 조이스틱 상태를 읽습니다" },
      ],
    },
    initCheck: `# PS2 조이스틱 테스트
from machine import ADC, Pin
x = ADC(Pin(26))
y = ADC(Pin(27))
btn = Pin(18, Pin.IN, Pin.PULL_UP)
xv = x.read_u16()
yv = y.read_u16()
bv = btn.value()
print(f"VRx: {xv}, VRy: {yv}, SW: {bv}")
if 10000 < xv < 55000 and 10000 < yv < 55000:
    print("\\u2705 조이스틱이 중앙에 있어요! 움직여보세요.")
else:
    print("\\u2705 조이스틱 값이 읽히고 있어요!")`,
  },

  TOUCH: {
    id: "TOUCH", name: "터치 센서", model: "Touch Sensor", label: "터치 감지",
    icon: "👆", color: "#cc5511",
    category: "입력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "손가락 터치를 감지하는 정전식 센서",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. 터치하면 1이 돼요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
touch = Pin(16, Pin.IN)

while True:
    # 터치 감지 (1=터치됨, 0=없음)
    if touch.value() == 1:
        print("터치 감지!")
    else:
        print("대기 중...")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 디지털 입력으로 설정합니다" },
        { line: 5, text: "touch라는 이름으로 터치 센서를 사용합니다" },
        { line: 7, text: "영원히 반복합니다" },
        { line: 9, text: "value()가 1이면 손가락이 센서를 터치한 것" },
        { line: 10, text: "터치 감지 메시지를 출력합니다" },
        { line: 12, text: "터치하지 않으면 대기 상태" },
        { line: 13, text: "0.1초마다 터치 상태를 확인합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. 정전식 터치 센서는 손가락으로 터치하면 HIGH(1)가 돼요.",
      code: `from machine import Pin
import time

# GP16번 핀을 디지털 입력으로 설정
touch = Pin(16, Pin.IN)

while True:
    if touch.value() == 1:
        print("터치!")
    time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "핀 기능을 가져옵니다" },
        { line: 4, text: "GP16을 디지털 입력으로 설정합니다" },
        { line: 8, text: "값이 1이면 터치 감지" },
      ],
    },
    initCheck: `# 터치 센서 테스트
from machine import Pin
import time
t = Pin(16, Pin.IN)
print("터치 센서를 손가락으로 터치해보세요!")
for i in range(50):
    if t.value() == 1:
        print("\\u2705 터치가 감지됐어요!")
        break
    time.sleep(0.1)
else:
    print("5초간 터치 없음. 센서를 터치해보세요.")`,
  },

  // ═══════════════════ 출력 (5종, LED 포함) ═══════════════════
  LED: {
    id: "LED", name: "LED", model: "LED", label: "LED 깜빡이기",
    icon: "💡", color: "#88aaff",
    category: "출력", protocol: "GPIO", address: null,
    difficulty: 1, lessons: [], recommended: true,
    description: "전기 신호로 켜고 끄는 작은 전구예요. Pico의 첫 번째 프로젝트로 딱!",
    grove: true,
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
    initCheck: `# LED 테스트
from machine import Pin
import time
led = Pin(16, Pin.OUT)
led.on()
time.sleep(0.5)
led.off()
time.sleep(0.5)
led.on()
time.sleep(0.5)
led.off()
print("\\u2705 LED가 두 번 깜빡였나요?")`,
  },

  LED_BAR: {
    id: "LED_BAR", name: "LED 바", model: "LED Bar v2", label: "10단계 표시",
    icon: "📊", color: "#7799ff",
    category: "출력", protocol: "디지털", address: null,
    difficulty: 2, lessons: [],
    description: "10단계 LED로 값을 시각적으로 표시하는 장치",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "CLK", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "DIO", pico: 22, picoName: "GP17", gp: 17, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. MY9221 드라이버 칩으로 10개 LED를 제어해요.",
      code: `from machine import Pin
import time

# MY9221 LED Bar 드라이버
clk = Pin(16, Pin.OUT)
dio = Pin(17, Pin.OUT)

def send_byte(data):
    for i in range(8):
        if data & 0x80:
            dio.on()
        else:
            dio.off()
        clk.on()
        clk.off()
        data <<= 1

def latch():
    dio.off()
    time.sleep_us(220)
    for i in range(4):
        dio.on()
        dio.off()

def set_level(level):
    # level: 0~10 (켤 LED 개수)
    send_byte(0x00)  # 명령 바이트
    send_byte(0x00)
    for i in range(12):
        if i < level:
            send_byte(0xFF)  # LED ON
        else:
            send_byte(0x00)  # LED OFF
    latch()

# 0~10 단계로 순서대로 켜기
while True:
    for level in range(11):
        set_level(level)
        print(f"LED 바: {'█' * level}{'░' * (10 - level)} ({level}/10)")
        time.sleep(0.3)
    for level in range(10, -1, -1):
        set_level(level)
        time.sleep(0.3)`,
      annotations: [
        { line: 1, text: "Pico의 핀(Pin) 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "MY9221 LED 바 드라이버 칩을 제어합니다" },
        { line: 5, text: "GP16을 CLK(클록) 출력으로 설정합니다" },
        { line: 6, text: "GP17을 DIO(데이터) 출력으로 설정합니다" },
        { line: 8, text: "1바이트(8비트) 데이터를 전송하는 함수" },
        { line: 9, text: "비트를 하나씩 보냅니다 (MSB 먼저)" },
        { line: 17, text: "데이터 전송 완료를 알리는 래치 신호" },
        { line: 23, text: "켤 LED 개수(0~10)를 설정하는 함수" },
        { line: 24, text: "명령 바이트를 전송합니다" },
        { line: 26, text: "12개 채널 중 level 개만큼 ON" },
        { line: 34, text: "0에서 10까지 하나씩 켜고 다시 끄기를 반복" },
        { line: 36, text: "막대 그래프처럼 LED 상태를 출력합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "CLK", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "DIO", pico: 22, picoName: "GP17", gp: 17, wire: "#dddddd", label: "흰색" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. CLK과 DIO 두 핀이 필요해요.",
      code: `from machine import Pin
import time

clk = Pin(16, Pin.OUT)
dio = Pin(17, Pin.OUT)

def send_byte(data):
    for i in range(8):
        dio.value(data >> 7 & 1)
        clk.on()
        clk.off()
        data <<= 1

def latch():
    dio.off()
    time.sleep_us(220)
    for i in range(4):
        dio.on()
        dio.off()

def set_level(level):
    send_byte(0x00)
    send_byte(0x00)
    for i in range(12):
        send_byte(0xFF if i < level else 0x00)
    latch()

while True:
    for lv in range(11):
        set_level(lv)
        print(f"Level: {lv}/10")
        time.sleep(0.3)
    for lv in range(10, -1, -1):
        set_level(lv)
        time.sleep(0.3)`,
      annotations: [
        { line: 3, text: "GP16(CLK)과 GP17(DIO)을 출력으로 설정" },
        { line: 6, text: "MY9221 드라이버에 바이트 데이터 전송" },
        { line: 20, text: "level(0~10) 개수만큼 LED를 켭니다" },
      ],
    },
    initCheck: `# LED 바 테스트
from machine import Pin
import time
clk = Pin(16, Pin.OUT)
dio = Pin(17, Pin.OUT)
def send_byte(d):
    for i in range(8):
        dio.value(d >> 7 & 1)
        clk.on(); clk.off(); d <<= 1
def latch():
    dio.off(); time.sleep_us(220)
    for i in range(4): dio.on(); dio.off()
send_byte(0x00); send_byte(0x00)
for i in range(12): send_byte(0xFF)
latch()
print("\\u2705 LED 바가 전부 켜졌나요?")`,
  },

  OLED: {
    id: "OLED", name: "OLED 디스플레이", model: "SSD1306", label: "텍스트/그래픽 표시",
    icon: "🖥️", color: "#6688ee",
    category: "출력", protocol: "I2C", address: "0x3C",
    difficulty: 2, lessons: [],
    description: "128x64 픽셀 OLED에 텍스트와 그래픽을 표시",
    grove: true,
    shield: {
      grovePort: { name: "I2C1", type: "I2C", position: "left-bottom", color: "#00ff88" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: "ssd1306 라이브러리를 먼저 설치해야 해요! Thonny → 도구 → 패키지 관리 → 'micropython-ssd1306' 검색 → 설치",
      note: "Grove Shield I2C1 포트에 꽂으세요. 다른 I2C 센서와 동시 사용 가능해요.",
      code: `from machine import I2C, Pin
import ssd1306
import time

# I2C 통신 설정 (Grove Shield I2C1 포트)
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=400000)

# OLED 디스플레이 초기화 (128x64 픽셀)
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

# 화면 지우기
oled.fill(0)

# 텍스트 표시하기
oled.text("Hello Pico!", 0, 0)    # (텍스트, x, y)
oled.text("MicroPython", 0, 16)
oled.text("OLED Test!", 0, 32)

# 화면에 출력 (show를 호출해야 보여요!)
oled.show()
print("OLED에 텍스트를 표시했어요!")

time.sleep(3)

# 카운터 표시
count = 0
while True:
    oled.fill(0)
    oled.text(f"Count: {count}", 0, 0)
    oled.text("Press Ctrl+C", 0, 48)
    oled.text("to stop", 0, 56)
    oled.show()
    count += 1
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "OLED 디스플레이 라이브러리를 가져옵니다 (설치 필요!)" },
        { line: 3, text: "시간 관련 기능을 가져옵니다" },
        { line: 5, text: "I2C 1번 버스, 400kHz (OLED는 빠른 속도 OK)" },
        { line: 6, text: "GP6(SDA)과 GP7(SCL)로 I2C 통신합니다" },
        { line: 8, text: "128x64 픽셀 OLED 디스플레이를 초기화합니다" },
        { line: 9, text: "SSD1306 칩을 사용하는 I2C OLED 객체를 만듭니다" },
        { line: 11, text: "화면을 검정색(0)으로 지웁니다" },
        { line: 14, text: "텍스트를 표시합니다. (텍스트, x좌표, y좌표) 형식이에요" },
        { line: 15, text: "x=0은 왼쪽 끝, y=0은 위쪽 끝. y를 16씩 늘리면 다음 줄" },
        { line: 19, text: "show()를 호출해야 화면에 실제로 표시돼요! 이걸 빼먹으면 안 보여요" },
        { line: 25, text: "매초 카운터 값을 OLED에 표시합니다" },
        { line: 26, text: "fill(0)으로 화면을 지우고 다시 그립니다 (깜빡임 없이!)" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SDA", pico: 9, picoName: "GP6", gp: 6, wire: "#ffdd00", label: "노랑" },
        { sensor: "SCL", pico: 10, picoName: "GP7", gp: 7, wire: "#dddddd", label: "흰색" },
      ],
      warning: "4.7kΩ 풀업 저항 2개 필수! ssd1306 라이브러리도 설치 필요.",
      note: "점퍼선으로 직접 연결. I2C 주소는 보통 0x3C (일부 모듈은 0x3D).",
      code: `from machine import I2C, Pin
import ssd1306
import time

# 직접 연결 — 내부 풀업 활성화
sda = Pin(6, pull=Pin.PULL_UP)
scl = Pin(7, pull=Pin.PULL_UP)
i2c = I2C(1, sda=sda, scl=scl, freq=400000)

# OLED 초기화
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

oled.fill(0)
oled.text("Direct Wire!", 0, 0)
oled.text("Hello Pico!", 0, 16)
oled.show()

count = 0
while True:
    oled.fill(0)
    oled.text(f"Count: {count}", 0, 0)
    oled.show()
    count += 1
    time.sleep(1)`,
      annotations: [
        { line: 1, text: "I2C 통신과 핀 기능을 가져옵니다" },
        { line: 2, text: "OLED 라이브러리 (Thonny에서 설치 필요)" },
        { line: 5, text: "직접 연결이라 내부 풀업 저항을 켭니다" },
        { line: 8, text: "I2C 1번 버스, 400kHz 속도로 통신 설정" },
        { line: 11, text: "128x64 OLED 디스플레이 초기화" },
        { line: 13, text: "화면을 지우고 텍스트를 표시합니다" },
        { line: 16, text: "show()를 꼭 호출해야 화면에 보여요!" },
      ],
    },
    initCheck: `# OLED 디스플레이 인식 확인
from machine import I2C, Pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7), freq=100000)
found = i2c.scan()
print("발견된 장치:", [hex(addr) for addr in found])
if 0x3C in found:
    print("\\u2705 OLED 디스플레이를 찾았어요!")
elif 0x3D in found:
    print("\\u2705 OLED 디스플레이를 찾았어요! (주소: 0x3D)")
else:
    print("\\u274C OLED를 찾지 못했어요. 배선을 확인하세요.")`,
  },

  BUZZER: {
    id: "BUZZER", name: "부저", model: "Buzzer", label: "소리 출력",
    icon: "🔔", color: "#5577dd",
    category: "출력", protocol: "디지털", address: null,
    difficulty: 1, lessons: [],
    description: "소리를 출력하는 피에조 부저",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. PWM 주파수로 음계를 만들어요.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
buzzer = PWM(Pin(16))

# 음계 주파수 (도레미파솔라시도)
notes = {
    'do': 262, 're': 294, 'mi': 330, 'fa': 349,
    'sol': 392, 'la': 440, 'si': 494, 'do2': 523
}

def play(note, duration=0.3):
    buzzer.freq(notes[note])
    buzzer.duty_u16(32768)  # 50% 듀티 (소리 ON)
    time.sleep(duration)
    buzzer.duty_u16(0)       # 소리 OFF
    time.sleep(0.05)         # 음 사이 간격

# 도레미파솔라시도 연주
print("도레미파솔라시도!")
for note in ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do2']:
    print(f"  {note} ({notes[note]}Hz)")
    play(note)

time.sleep(1)

# 반복 비프음
while True:
    buzzer.freq(1000)
    buzzer.duty_u16(32768)
    print("삐!")
    time.sleep(0.1)
    buzzer.duty_u16(0)
    time.sleep(0.9)`,
      annotations: [
        { line: 1, text: "핀(Pin)과 PWM 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 PWM 출력으로 설정합니다" },
        { line: 5, text: "buzzer라는 이름으로 부저를 제어합니다" },
        { line: 7, text: "음계별 주파수를 정의합니다 (단위: Hz)" },
        { line: 8, text: "도=262Hz, 레=294Hz 등 각 음의 주파수예요" },
        { line: 12, text: "음을 연주하는 함수를 만듭니다" },
        { line: 13, text: "해당 음의 주파수로 PWM을 설정합니다" },
        { line: 14, text: "50% 듀티(반반 ON/OFF)로 소리를 냅니다" },
        { line: 15, text: "정해진 시간만큼 소리를 냅니다" },
        { line: 16, text: "소리를 끕니다 (듀티 0)" },
        { line: 17, text: "음 사이에 짧은 간격을 둡니다" },
        { line: 20, text: "도레미파솔라시도를 순서대로 연주합니다" },
        { line: 21, text: "음계 리스트를 하나씩 꺼내서 연주합니다" },
        { line: 27, text: "1초마다 비프음을 반복합니다" },
      ],
    },
    direct: {
      pins: [
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
        { sensor: "GND", pico: 23, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
      ],
      warning: null,
      note: "점퍼선으로 직접 연결. PWM 주파수를 바꾸면 다른 음이 나요.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
buzzer = PWM(Pin(16))

# 도레미파솔라시도
for freq in [262, 294, 330, 349, 392, 440, 494, 523]:
    buzzer.freq(freq)
    buzzer.duty_u16(32768)
    time.sleep(0.3)
buzzer.duty_u16(0)

while True:
    buzzer.freq(1000)
    buzzer.duty_u16(32768)
    time.sleep(0.1)
    buzzer.duty_u16(0)
    time.sleep(0.9)`,
      annotations: [
        { line: 1, text: "핀과 PWM 기능을 가져옵니다" },
        { line: 4, text: "GP16을 PWM 출력으로 설정합니다" },
        { line: 7, text: "도(262Hz)부터 높은도(523Hz)까지 연주합니다" },
        { line: 8, text: "주파수를 설정하고 소리를 냅니다" },
        { line: 12, text: "소리를 끕니다" },
      ],
    },
    initCheck: `# 부저 테스트
from machine import Pin, PWM
import time
buzzer = PWM(Pin(16))
buzzer.freq(1000)
buzzer.duty_u16(32768)
time.sleep(0.3)
buzzer.duty_u16(0)
print("\\u2705 부저에서 '삐' 소리가 났나요?")`,
  },

  SERVO: {
    id: "SERVO", name: "서보 모터", model: "Servo Motor", label: "각도 제어",
    icon: "⚙️", color: "#4466cc",
    category: "출력", protocol: "PWM", address: null,
    difficulty: 2, lessons: [],
    description: "정확한 각도로 회전하는 모터 (0~180도)",
    grove: true,
    shield: {
      grovePort: { name: "D16", type: "디지털", position: "right-bottom", color: "#00ccff" },
      pins: [
        { sensor: "VCC", pico: 36, picoName: "3.3V", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: "서보 모터는 전류를 많이 써요! 여러 개를 동시에 쓸 때는 외부 전원이 필요해요.",
      note: "Grove Shield 디지털 D16 포트에 꽂으세요. PWM 신호로 각도를 제어해요.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
servo = PWM(Pin(16))
servo.freq(50)  # 서보 모터는 50Hz 주파수 사용

def set_angle(angle):
    # 각도(0~180)를 PWM 듀티값으로 변환
    # 0도=1ms(3277), 90도=1.5ms(4915), 180도=2ms(6553)
    min_duty = 1638   # 0.5ms (여유 있게)
    max_duty = 8192   # 2.5ms (여유 있게)
    duty = int(min_duty + (max_duty - min_duty) * angle / 180)
    servo.duty_u16(duty)

# 서보 모터 테스트: 0도 → 90도 → 180도
print("0도로 이동")
set_angle(0)
time.sleep(1)

print("90도로 이동")
set_angle(90)
time.sleep(1)

print("180도로 이동")
set_angle(180)
time.sleep(1)

# 반복 스윙
while True:
    for angle in range(0, 181, 10):
        set_angle(angle)
        print(f"각도: {angle}도")
        time.sleep(0.1)
    for angle in range(180, -1, -10):
        set_angle(angle)
        time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "핀(Pin)과 PWM 기능을 가져옵니다" },
        { line: 2, text: "시간 관련 기능을 가져옵니다" },
        { line: 4, text: "GP16번 핀을 PWM(펄스폭변조) 출력으로 설정합니다" },
        { line: 5, text: "servo라는 이름으로 PWM 객체를 만듭니다" },
        { line: 6, text: "서보 모터 표준 주파수 50Hz (20ms 주기)로 설정" },
        { line: 8, text: "각도를 입력하면 서보가 움직이는 함수를 만듭니다" },
        { line: 10, text: "서보 모터는 펄스 폭으로 각도를 결정해요 (0.5~2.5ms)" },
        { line: 13, text: "각도를 PWM 듀티값으로 계산합니다" },
        { line: 14, text: "계산된 듀티값으로 PWM 신호를 출력합니다" },
        { line: 16, text: "서보 모터를 여러 각도로 테스트합니다" },
        { line: 18, text: "0도로 이동하고 1초 대기" },
        { line: 21, text: "90도(중간)로 이동하고 1초 대기" },
        { line: 24, text: "180도(최대)로 이동하고 1초 대기" },
        { line: 28, text: "0도에서 180도까지 10도씩 왔다갔다 반복합니다" },
        { line: 29, text: "range(0, 181, 10)은 0, 10, 20, ..., 180" },
      ],
    },
    direct: {
      pins: [
        { sensor: "VCC", pico: 40, picoName: "VBUS(5V)", gp: null, wire: "#ff4444", label: "빨강" },
        { sensor: "GND", pico: 38, picoName: "GND", gp: null, wire: "#666666", label: "검정" },
        { sensor: "SIG", pico: 21, picoName: "GP16", gp: 16, wire: "#ffdd00", label: "노랑" },
      ],
      warning: "서보 모터 전원은 VBUS(5V)에 연결하세요! 3.3V로는 힘이 부족해요. 신호선만 GP핀에 연결.",
      note: "점퍼선으로 직접 연결. 서보 모터 색깔: 빨강=VCC, 갈색/검정=GND, 주황/노랑=SIG.",
      code: `from machine import Pin, PWM
import time

# GP16번 핀을 PWM 출력으로 설정
servo = PWM(Pin(16))
servo.freq(50)

def set_angle(angle):
    min_duty = 1638
    max_duty = 8192
    duty = int(min_duty + (max_duty - min_duty) * angle / 180)
    servo.duty_u16(duty)

while True:
    for angle in range(0, 181, 10):
        set_angle(angle)
        print(f"각도: {angle}도")
        time.sleep(0.1)
    for angle in range(180, -1, -10):
        set_angle(angle)
        time.sleep(0.1)`,
      annotations: [
        { line: 1, text: "핀과 PWM 기능을 가져옵니다" },
        { line: 4, text: "GP16을 PWM 출력으로 설정" },
        { line: 6, text: "서보 모터 표준 주파수 50Hz" },
        { line: 8, text: "각도를 듀티값으로 변환하는 함수" },
        { line: 14, text: "0도~180도를 10도 단위로 왔다갔다 합니다" },
      ],
    },
    initCheck: `# 서보 모터 테스트
from machine import Pin, PWM
import time
servo = PWM(Pin(16))
servo.freq(50)
min_duty = 1638
max_duty = 8192
duty_90 = int(min_duty + (max_duty - min_duty) * 90 / 180)
servo.duty_u16(duty_90)
time.sleep(1)
duty_0 = min_duty
servo.duty_u16(duty_0)
time.sleep(1)
servo.duty_u16(duty_90)
time.sleep(0.5)
servo.duty_u16(0)
print("\\u2705 서보 모터가 움직였나요? (90도 → 0도 → 90도)")`,
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
  "DHT20", "BMP280", "SCD30", "MOISTURE", "GUVAS12D", "TDS", "HM3301", "MULTIGAS",
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
