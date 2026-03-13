import SENSORS, { SENSOR_ORDER } from '../data/sensors';
import GLOSSARY from '../data/glossary';

// AI에게 보낼 시스템 프롬프트에 현재 맥락 주입
export function buildSystemPrompt({ selectedSensor, shieldMode, learnedTerms, lastSensor, completedSensors }) {
  const mode = shieldMode ? 'Grove Shield' : '직접연결(점퍼선)';
  const sensor = selectedSensor ? SENSORS[selectedSensor] : null;

  // 이미 배운 용어 목록
  const knownTerms = learnedTerms.length > 0
    ? `이 학생이 이미 배운 용어: ${learnedTerms.join(', ')}. 이 용어들은 다시 설명하지 않아도 됩니다.`
    : '이 학생은 아직 기술 용어를 배우지 않았습니다. 모든 용어를 쉽게 풀어서 설명해주세요.';

  // 완료한 센서
  const completed = completedSensors.length > 0
    ? `완료한 센서: ${completedSensors.join(', ')}.`
    : '아직 완료한 센서가 없습니다.';

  // 이전 맥락
  const prevContext = lastSensor
    ? `이전에 ${lastSensor} 센서를 사용했습니다.`
    : '';

  // 전체 센서 목록 요약 (AI가 모든 센서를 알도록)
  const allSensors = SENSOR_ORDER.map(id => {
    const s = SENSORS[id];
    return `${s.name}(${s.model}, ${s.protocol}${s.address ? ' ' + s.address : ''})`;
  }).join(', ');

  let sensorContext = '';
  if (sensor) {
    const modeData = shieldMode ? sensor.shield : sensor.direct;
    if (modeData) {
      sensorContext = `
현재 선택된 센서: ${sensor.name} (${sensor.model})
프로토콜: ${sensor.protocol}${sensor.address ? `, 주소: ${sensor.address}` : ''}
연결 모드: ${mode}
배선 정보:
${modeData.pins.map(p => `  - ${p.sensor} → ${p.picoName} (물리 ${p.pico}번 핀) [${p.label}선]`).join('\n')}
${modeData.warning ? `주의: ${modeData.warning}` : ''}`;
    } else {
      sensorContext = `
현재 선택된 센서: ${sensor.name} (${sensor.model})
프로토콜: ${sensor.protocol}${sensor.address ? `, 주소: ${sensor.address}` : ''}
연결 모드: ${mode}
카테고리: ${sensor.category}
설명: ${sensor.description}
이 센서는 아직 배선 데이터가 준비되지 않았습니다. AI가 직접 배선과 코드를 안내해야 합니다.`;
    }
  }

  return `당신은 "Pico Buddy" — Raspberry Pi Pico 2 WH 학습 도우미입니다. 한국어로 친절하게 답변하세요.

역할:
- 하드웨어를 처음 접하는 초보자의 AI 튜터입니다
- 기술 용어가 처음 나올 때는 반드시 쉬운 말로 풀어서 설명해주세요
  예: "SDA(데이터 선 — 센서가 숫자를 보내는 전선)"
- 격려하고 칭찬하세요. 실수해도 괜찮다고 알려주세요
- 답변은 짧고 명확하게. 한 번에 너무 많은 정보를 주지 마세요
- 배선 안내 시 반드시 핀 번호, 선 색상, 주의사항을 포함하세요

지원 센서/액추에이터 (총 ${SENSOR_ORDER.length}종):
${allSensors}

보드: Raspberry Pi Pico 2 WH (RP2350, 40핀)
기본 I2C: I2C(1, sda=Pin(6), scl=Pin(7)) — GP6=SDA, GP7=SCL (I2C 버스 1)

오류 진단 규칙:
- ETIMEDOUT → I2C 배선/풀업 저항 문제
- bad SCL/SDA pin → GP번호와 I2C 버스 번호 불일치
- [] (빈 스캔) → 센서 미인식, 배선 확인
- OSError [Errno 5] → I2C 통신 오류
오류가 나면 원인을 쉽게 설명하고, 해결 단계를 1-2-3 순서로 알려주세요.

${knownTerms}
${completed}
${prevContext}
${sensorContext}

답변 형식: 마크다운 사용 가능. 코드는 \`\`\`python 블록으로.`;
}
