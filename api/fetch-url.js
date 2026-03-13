// URL 유효성 검증 — SSRF 방지
function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('유효하지 않은 URL 형식입니다.');
  }

  // http, https 프로토콜만 허용
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('http 또는 https 프로토콜만 허용됩니다.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // 내부 네트워크 주소 차단
  const blockedPatterns = [
    /^localhost$/,
    /^127\.\d+\.\d+\.\d+$/,
    /^10\.\d+\.\d+\.\d+$/,
    /^192\.168\.\d+\.\d+$/,
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
    /^0\.0\.0\.0$/,
    /^\[?::1\]?$/,              // IPv6 루프백
    /^169\.254\.\d+\.\d+$/,     // 링크 로컬 주소
    /\.local$/,                  // mDNS 로컬 도메인
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(hostname)) {
      throw new Error('내부 네트워크 주소에 대한 접근은 차단됩니다.');
    }
  }

  return parsed.href;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  // URL 검증
  let validatedUrl;
  try {
    validatedUrl = validateUrl(url);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const response = await fetch(validatedUrl, {
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
        messages: [{ role: 'user', content: `이 웹페이지 내용을 분석해주세요:\n\nURL: ${validatedUrl}\n\n내용:\n${textContent}` }],
      }),
    });

    const analysisData = await analysisResponse.json();
    res.json({ analysis: analysisData.content?.[0]?.text || '분석할 수 없습니다.' });
  } catch (error) {
    console.error('URL 분석 오류:', error);
    res.status(500).json({ error: 'URL을 분석할 수 없습니다.' });
  }
}
