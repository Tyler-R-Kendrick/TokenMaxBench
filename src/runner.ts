import { createBenchmarkPrompt } from '../evals/benchmarks.js';
import { scoreBenchmarkOutput } from './scoring.js';
import { byteLength, estimateTokens } from './tokens.js';
import type { BenchmarkResult, BenchmarkRunConfig, Scorecard } from './types.js';

export async function runBenchmarks(config: BenchmarkRunConfig): Promise<Scorecard> {
  const runId = config.runId ?? `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const results: BenchmarkResult[] = [];

  for (const benchmark of config.cases) {
    const prompt = createBenchmarkPrompt(benchmark);
    const startedAt = performance.now();
    const providerResult = await config.provider.run({ case: benchmark, prompt, runId });
    const latencyMs = Math.round(performance.now() - startedAt);
    const scores = await scoreBenchmarkOutput(benchmark, providerResult.output);
    results.push({
      id: benchmark.id,
      title: benchmark.title,
      category: benchmark.category,
      output: providerResult.output,
      latencyMs,
      inputTokens: providerResult.usage.inputTokens || estimateTokens(prompt),
      outputTokens: providerResult.usage.outputTokens || estimateTokens(providerResult.output),
      totalTokens: providerResult.usage.totalTokens || estimateTokens(prompt) + estimateTokens(providerResult.output),
      outputChars: providerResult.output.length,
      outputBytes: byteLength(providerResult.output),
      providerMetadata: providerResult.metadata,
      ...scores
    });
  }

  return {
    runId,
    createdAt: new Date().toISOString(),
    provider: {
      id: config.provider.id,
      label: config.provider.label,
      setup: config.provider.setup
    },
    results,
    summary: summarize(results)
  };
}

function summarize(results: BenchmarkResult[]): Scorecard['summary'] {
  const caseCount = results.length;
  return {
    caseCount,
    totalInputTokens: sum(results.map((item) => item.inputTokens)),
    totalOutputTokens: sum(results.map((item) => item.outputTokens)),
    totalTokens: sum(results.map((item) => item.totalTokens)),
    averageLatencyMs: avg(results.map((item) => item.latencyMs)),
    averageOverallScore: avg(results.map((item) => item.overallScore)),
    failedCaseCount: results.filter((item) => item.failures.length > 0).length
  };
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function avg(values: number[]): number {
  return values.length === 0 ? 0 : Number((sum(values) / values.length).toFixed(3));
}
