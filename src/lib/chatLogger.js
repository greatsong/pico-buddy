import SENSORS from '../data/sensors';

// 채팅 히스토리를 마크다운 파일로 변환
export function generateChatMarkdown(messages, { selectedSensor, shieldMode, learnedTerms }) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  const sensor = selectedSensor ? SENSORS[selectedSensor] : null;
  const mode = shieldMode ? 'Grove Shield' : '직접연결';

  let md = `# Pico 학습 기록 — ${dateStr}\n\n`;
  md += `> 생성 시각: ${dateStr} ${timeStr}\n\n`;

  if (sensor) {
    md += `## 사용한 센서\n`;
    md += `- **${sensor.icon} ${sensor.name}** (${sensor.label})\n`;
    md += `- 연결 방식: ${mode}\n`;
    if (sensor.protocol === 'I2C') {
      md += `- 프로토콜: I2C, 주소: ${sensor.address}\n`;
    }
    md += '\n';

    const modeData = shieldMode ? sensor.shield : sensor.direct;
    if (modeData) {
      md += `### 배선 정보\n`;
      modeData.pins.forEach(p => {
        md += `- ${p.sensor} → ${p.picoName} (${p.pico}번 핀) [${p.label}선]\n`;
      });
      if (modeData.warning) {
        md += `\n> ⚠️ ${modeData.warning}\n`;
      }
      md += '\n';

      md += `### 코드\n\`\`\`python\n${modeData.code}\n\`\`\`\n\n`;
    }
  }

  if (learnedTerms && learnedTerms.length > 0) {
    md += `## 배운 용어\n`;
    learnedTerms.forEach(term => {
      md += `- **${term}**\n`;
    });
    md += '\n';
  }

  md += `## 대화 내용\n\n`;
  messages.forEach(msg => {
    if (msg.role === 'user') {
      md += `**나:** ${msg.text}\n\n`;
    } else if (msg.role === 'assistant') {
      md += `**AI 튜터:** ${msg.text}\n\n`;
    }
    md += '---\n\n';
  });

  md += `\n> 📌 Visual Pico 학습 도우미로 생성됨\n`;

  return md;
}

// 마크다운 파일 다운로드
export function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `pico-학습기록-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
