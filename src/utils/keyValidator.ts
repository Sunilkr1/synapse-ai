/**
 * Validates that an API key matches the expected format for a given provider.
 */
export function validateApiKey(provider: string, key: string): { valid: boolean; message: string } {
  const trimmed = key.trim();

  if (!trimmed) {
    return { valid: false, message: 'API key cannot be empty.' };
  }

  switch (provider) {
    case 'openai':
      if (!trimmed.startsWith('sk-')) {
        return { valid: false, message: 'OpenAI keys start with "sk-".' };
      }
      break;
    case 'anthropic':
      if (!trimmed.startsWith('sk-ant-')) {
        return { valid: false, message: 'Anthropic keys start with "sk-ant-".' };
      }
      break;
    case 'gemini':
      if (trimmed.length < 30) {
        return { valid: false, message: 'Gemini keys are typically longer. Please check your key.' };
      }
      break;
    default:
      if (trimmed.length < 10) {
        return { valid: false, message: 'Key seems too short. Please double-check.' };
      }
  }

  return { valid: true, message: 'Key looks valid!' };
}
