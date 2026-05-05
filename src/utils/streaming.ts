// Streaming utilities — placeholder for future SSE/streaming implementation.
// Currently all providers use non-streaming (full response) mode.

export async function* streamResponse(
  url: string,
  body: object,
  headers: Record<string, string>
): AsyncGenerator<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

  if (!response.body) throw new Error('Response body is null');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.startsWith('data: ') && l !== 'data: [DONE]');
    for (const line of lines) {
      try {
        const json = JSON.parse(line.replace('data: ', ''));
        const text = json.choices?.[0]?.delta?.content ?? '';
        if (text) yield text;
      } catch {
        // Ignore parse errors
      }
    }
  }
}
