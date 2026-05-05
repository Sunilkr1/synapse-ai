/**
 * Generates a smart title for a chat session from the first user message.
 */
export function generateChatTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');
  if (cleaned.length <= 40) return cleaned;
  return cleaned.substring(0, 37) + '...';
}
