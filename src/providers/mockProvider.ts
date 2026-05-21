import { estimateTokens } from '../tokens.js';
import { EMPTY_SETUP, type BenchmarkProvider } from '../types.js';

export function createMockProvider(output: string): BenchmarkProvider {
  return {
    id: 'mock',
    label: 'Mock Provider',
    setup: { ...EMPTY_SETUP, env: {} },
    async run(input) {
      return {
        output,
        usage: {
          inputTokens: estimateTokens(input.prompt),
          outputTokens: estimateTokens(output),
          totalTokens: estimateTokens(input.prompt) + estimateTokens(output)
        },
        metadata: { deterministic: true }
      };
    }
  };
}
