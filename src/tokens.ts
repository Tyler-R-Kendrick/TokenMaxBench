export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function byteLength(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}
