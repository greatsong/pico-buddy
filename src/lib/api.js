// Claude API 스트리밍 호출 — Express/Vercel 프록시를 통해
const STREAM_TIMEOUT_MS = 30_000; // 스트리밍 응답 제한 시간 (30초)

export async function callClaudeStream(messages, systemPrompt, onChunk) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system: systemPrompt }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // API 서버 응답 오류 (4xx, 5xx)
      const errorBody = await res.text().catch(() => '');
      throw new Error(`API 오류 (${res.status}): ${errorBody || '서버 응답 오류'}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 데이터를 수신할 때마다 타임아웃 갱신
      clearTimeout(timeoutId);
      const renewedTimeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              onChunk(fullText);
            }
          } catch {}
        }
      }

      // 갱신된 타임아웃 정리를 위해 참조 유지
      clearTimeout(renewedTimeoutId);
    }

    return fullText || '응답을 받지 못했습니다.';
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('응답 시간이 초과되었습니다 (30초). 네트워크 상태를 확인하고 다시 시도해 주세요.');
    }
    if (err.message.startsWith('API 오류')) {
      throw err;
    }
    // 네트워크 오류 (오프라인, DNS 실패 등)
    throw new Error(`네트워크 오류: ${err.message || '서버에 연결할 수 없습니다.'}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
