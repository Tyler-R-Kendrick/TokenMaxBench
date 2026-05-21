import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BENCHMARK_CASES } from '../evals/benchmarks.js';
import { DEFAULT_SCORECARD_JSON } from './cliDefaults.js';
import { createCodexProvider } from './providers/codexProvider.js';
import { createGitHubCopilotProvider } from './providers/githubCopilotProvider.js';
import { createMockProvider } from './providers/mockProvider.js';
import { runBenchmarks } from './runner.js';
import { renderMarkdownReport } from './report.js';

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const args = new Set(argv);
  const providerName = valueAfter(argv, '--provider') ?? 'mock';
  const outputPath = valueAfter(argv, '--output') ?? DEFAULT_SCORECARD_JSON;

  const provider = providerName === 'github-copilot'
    ? createGitHubCopilotProvider()
    : providerName === 'codex'
      ? createCodexProvider()
      : createMockProvider('dry run output');

  const scorecard = await runBenchmarks({
    provider,
    cases: args.has('--smoke') ? BENCHMARK_CASES.slice(0, 1) : BENCHMARK_CASES
  });

  const payload = JSON.stringify(scorecard, null, 2);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, payload, 'utf8');
  await writeFile(markdownPath(outputPath), renderMarkdownReport(scorecard), 'utf8');
  console.log(`Wrote ${outputPath}`);
}

function valueAfter(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

function markdownPath(jsonPath: string): string {
  const parsed = path.parse(jsonPath);
  return path.join(parsed.dir, `${parsed.name}.md`);
}

function isCliEntry(): boolean {
  return process.argv[1] !== undefined && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
}

if (isCliEntry()) {
  await main();
}
