export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
