// Claude API 스트리밍 공통 모듈
// server/index.js와 api/chat.js에서 공유하는 SSE 스트리밍 로직

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1500;

/**
 * Claude API에 스트리밍 요청을 보내고 SSE 형식으로 응답을 중계합니다.
 * @param {object} options - 요청 옵션
 * @param {Array} options.messages - 대화 메시지 배열
 * @param {string} options.system - 시스템 프롬프트
 * @param {string} [options.model] - Claude 모델명 (기본: claude-sonnet-4-6)
 * @param {number} [options.maxTokens] - 최대 토큰 수 (기본: 1500)
 * @param {object} res - Express/Vercel 응답 객체
 */
export async function streamClaudeResponse({ messages, system, model, maxTokens }, res) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
      stream: true,
      system,
      messages,
    }),
  });

  // API 오류 응답 처리
  if (!response.ok) {
    const data = await response.json();
    return res.status(response.status).json({
      error: data.error?.message || 'API 오류',
    });
  }

  // SSE 스트리밍 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Anthropic 스트림을 클라이언트 SSE로 변환
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            res.write(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`);
          }
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}
