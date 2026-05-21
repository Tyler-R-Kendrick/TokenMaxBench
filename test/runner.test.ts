import { describe, expect, it } from 'vitest';
import { BENCHMARK_CASES } from '../src/fixtures.js';
import { createMockProvider } from '../src/providers/mockProvider.js';
import { runBenchmarks } from '../src/runner.js';

describe('runBenchmarks', () => {
  it('emits per-case results and aggregate scorecard', async () => {
    const cases = BENCHMARK_CASES.slice(0, 2);
    const output = [
      ...cases[0]!.expect.requiredTerms,
      ...cases[1]!.expect.requiredTerms,
      ...cases[0]!.expect.exactTerms ?? [],
      ...cases[1]!.expect.exactTerms ?? []
    ].join(' ');
    const scorecard = await runBenchmarks({
      provider: createMockProvider(output),
      cases,
      runId: 'test-run'
    });

    expect(scorecard.runId).toBe('test-run');
    expect(scorecard.provider.id).toBe('mock');
    expect(scorecard.results).toHaveLength(2);
    expect(scorecard.summary.caseCount).toBe(2);
    expect(scorecard.summary.totalInputTokens).toBeGreaterThan(0);
    expect(scorecard.summary.averageOverallScore).toBeGreaterThan(0);
  });
});
