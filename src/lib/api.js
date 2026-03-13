// Claude API 호출 — Express 프록시를 통해
export async function callClaude(messages, systemPrompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system: systemPrompt }),
  });

  if (!res.ok) {
    throw new Error(`API 오류: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '응답을 받지 못했습니다.';
}
