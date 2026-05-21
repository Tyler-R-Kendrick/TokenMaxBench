import { describe, expect, it } from 'vitest';
import { BENCHMARK_CASES, createBenchmarkPrompt } from '../evals/benchmarks.js';

describe('neutral benchmark cases', () => {
  it('duplicates UTK benchmark themes without framework pass/fail baselines', () => {
    expect(BENCHMARK_CASES.length).toBeGreaterThanOrEqual(8);
    expect(BENCHMARK_CASES.map((item) => item.id)).toContain('shell-git-status');
    expect(BENCHMARK_CASES.map((item) => item.id)).toContain('ci-failure-triage');
    expect(BENCHMARK_CASES.map((item) => item.id)).toContain('provider-adapter-openai-tool-call');

    for (const benchmark of BENCHMARK_CASES) {
      expect(benchmark.input.length).toBeGreaterThan(0);
      expect(benchmark.expect.requiredTerms.length + benchmark.expect.jsonFacts.length).toBeGreaterThan(0);
      expect(benchmark.metadata.sourceSuite).toMatch(/rtk|compresr|caveman|leanctx|bash/);
      expect(benchmark.metadata.sourcePath).toMatch(/^evals\/benchmarks\.ts#/);
      expect(benchmark.metadata.frameworkBaseline).toBeUndefined();
    }
  });

  it('builds prompts with workload and expected output instructions', () => {
    const prompt = createBenchmarkPrompt(BENCHMARK_CASES[0]!);

    expect(prompt).toContain(BENCHMARK_CASES[0]!.input);
    expect(prompt).toContain('Return concise answer');
    expect(prompt).toContain('Do not mention TokenMaxBench scoring');
  });
});
