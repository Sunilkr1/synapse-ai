/**
 * Rough token counter — 1 token ≈ 4 characters for English text.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Checks if a conversation is approaching a model's context limit.
 */
export function isNearContextLimit(messages: { content: string }[], limit: number): boolean {
  const total = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  return total > limit * 0.8;
}
