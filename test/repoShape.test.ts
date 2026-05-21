import { existsSync } from 'node:fs';
import { readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { main } from '../src/cli.js';
import { DEFAULT_RESULTS_DIR, DEFAULT_SCORECARD_JSON, DEFAULT_SCORECARD_MARKDOWN } from '../src/cliDefaults.js';

const root = process.cwd();

describe('repo benchmark shape', () => {
  beforeEach(async () => {
    await rm(path.join(root, DEFAULT_RESULTS_DIR), { recursive: true, force: true });
  });

  it('keeps benchmark corpus in evals and does not keep vendor/utk-evals', async () => {
    expect(existsSync(path.join(root, 'evals'))).toBe(true);
    expect(existsSync(path.join(root, 'vendor', 'utk-evals'))).toBe(false);

    const entries = await readdir(path.join(root, 'evals'));
    expect(entries).toEqual(['benchmarks.ts']);
  });

  it('documents canonical benchmark result location in AGENTS.md', async () => {
    const agents = await readFile(path.join(root, 'AGENTS.md'), 'utf8');

    expect(agents).toContain('Whenever running benchmarks');
    expect(agents).toContain('results/latest/scorecard.json');
    expect(agents).toContain('results/latest/scorecard.md');
  });

  it('writes latest scorecard files by default whenever CLI runs benchmarks', async () => {
    await main(['--provider', 'mock', '--smoke']);

    const json = await readFile(path.join(root, DEFAULT_SCORECARD_JSON), 'utf8');
    const markdown = await readFile(path.join(root, DEFAULT_SCORECARD_MARKDOWN), 'utf8');

    expect(JSON.parse(json).summary.caseCount).toBe(1);
    expect(markdown).toContain('# TokenMaxBench Scorecard');
  });
});
