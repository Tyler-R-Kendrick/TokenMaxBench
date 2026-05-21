import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BENCHMARK_CASES } from './fixtures.js';
import { createCodexProvider } from './providers/codexProvider.js';
import { createGitHubCopilotProvider } from './providers/githubCopilotProvider.js';
import { createMockProvider } from './providers/mockProvider.js';
import { runBenchmarks } from './runner.js';
import { renderMarkdownReport } from './report.js';

const args = new Set(process.argv.slice(2));
const providerName = valueAfter('--provider') ?? 'mock';
const outputPath = valueAfter('--output');

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
if (outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, payload, 'utf8');
  await writeFile(markdownPath(outputPath), renderMarkdownReport(scorecard), 'utf8');
} else {
  console.log(payload);
}

function valueAfter(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

function markdownPath(jsonPath: string): string {
  const parsed = path.parse(jsonPath);
  return path.join(parsed.dir, `${parsed.name}.md`);
}
