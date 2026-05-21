import { describe, expect, it } from 'vitest';
import { BENCHMARK_CASES } from '../src/fixtures.js';
import { createCodexProvider } from '../src/providers/codexProvider.js';
import { createGitHubCopilotProvider } from '../src/providers/githubCopilotProvider.js';
import { runBenchmarks } from '../src/runner.js';

describe('live SDK smoke tests', () => {
  it.runIf(process.env.TOKENMAXBENCH_LIVE_GITHUB_COPILOT === '1')('runs GitHub Copilot SDK with ambient auth', async () => {
    const scorecard = await runBenchmarks({
      provider: createGitHubCopilotProvider(),
      cases: BENCHMARK_CASES.slice(0, 1),
      runId: 'live-github-copilot'
    });

    expect(scorecard.results[0]!.output.length).toBeGreaterThan(0);
  }, 120000);

  it.runIf(process.env.TOKENMAXBENCH_LIVE_CODEX === '1')('runs Codex SDK with ambient auth', async () => {
    const scorecard = await runBenchmarks({
      provider: createCodexProvider(),
      cases: BENCHMARK_CASES.slice(0, 1),
      runId: 'live-codex'
    });

    expect(scorecard.results[0]!.output.length).toBeGreaterThan(0);
  }, 120000);
});
