export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PicoHelper/1.0)' },
    });
    const html = await response.text();

    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

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
}
