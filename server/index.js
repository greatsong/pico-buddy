import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4018;

app.use(cors());
app.use(express.json());

// Claude API 프록시
app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API 오류' });
    }

    res.json(data);
  } catch (error) {
    console.error('Claude API 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// URL 내용 가져오기 (센서/액추에이터 링크 분석)
app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PicoHelper/1.0)' },
    });
    const html = await response.text();

    // HTML에서 텍스트 추출 (간단한 파싱)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000); // 최대 5000자

    // Claude에게 분석 요청
    const analysisResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: `당신은 Raspberry Pi Pico 2 WH 전문가입니다. 다음 웹페이지 내용을 분석해서 초보자가 이해할 수 있도록 안내해주세요.

분석할 내용:
1. 이 센서/부품이 무엇인지 간단히 설명
2. Pico 2 WH와 어떻게 연결하는지 (I2C/GPIO/SPI 등)
3. 필요한 핀 연결 정보
4. 간단한 MicroPython 예제 코드
5. 주의사항

한국어로 친절하게 답변하세요.`,
        messages: [{ role: 'user', content: `이 웹페이지 내용을 분석해주세요:\n\nURL: ${url}\n\n내용:\n${textContent}` }],
      }),
    });

    const analysisData = await analysisResponse.json();
    res.json({ analysis: analysisData.content?.[0]?.text || '분석할 수 없습니다.' });
  } catch (error) {
    console.error('URL 분석 오류:', error);
    res.status(500).json({ error: 'URL을 분석할 수 없습니다.' });
  }
});

// 이미지 분석 (배선 사진 → AI 피드백)
app.post('/api/analyze-image', express.json({ limit: '10mb' }), async (req, res) => {
  const { image, mediaType, sensorContext } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: `당신은 Raspberry Pi Pico 2 WH 배선 전문가입니다. 학생이 보내는 배선 사진을 분석해서 피드백을 주세요.

분석할 것:
1. 배선이 올바른지 확인
2. 잘못된 부분이 있다면 구체적으로 지적
3. 위험한 연결(쇼트 등)이 있는지 확인
4. 개선 사항 제안

${sensorContext || ''}

한국어로 친절하게, 초보자가 이해할 수 있게 답변하세요.`,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: '이 배선이 맞는지 확인해주세요!' },
          ],
        }],
      }),
    });

    const data = await response.json();
    res.json({ analysis: data.content?.[0]?.text || '분석할 수 없습니다.' });
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    res.status(500).json({ error: '이미지를 분석할 수 없습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`API 프록시 서버: http://localhost:${PORT}`);
});
