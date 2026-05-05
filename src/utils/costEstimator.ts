/**
 * Estimates the approximate cost of an API call in USD.
 * Pricing is approximate and based on public rates (per 1M tokens).
 */
const COST_PER_1M_TOKENS: Record<string, { input: number; output: number }> = {
  'gemini': { input: 0.075, output: 0.30 },
  'openai': { input: 5.00, output: 15.00 },
  'anthropic': { input: 3.00, output: 15.00 },
  'groq': { input: 0.05, output: 0.10 },
  'mistral': { input: 0.25, output: 0.75 },
  'deepseek': { input: 0.14, output: 0.28 },
};

export function estimateCost(provider: string, inputTokens: number, outputTokens: number): string {
  const rates = COST_PER_1M_TOKENS[provider] ?? { input: 0, output: 0 };
  const cost = (inputTokens / 1_000_000) * rates.input + (outputTokens / 1_000_000) * rates.output;
  if (cost < 0.0001) return '< $0.0001';
  return `$${cost.toFixed(4)}`;
}
