# TokenMaxBench

Framework-neutral benchmarks for measuring token-reduction agent setups.

Active benchmark workloads live in `evals/benchmarks.ts`. The harness runs those workloads and records scorecards instead of asserting that one framework beats another.

## Providers

- `mock`: deterministic dry-run provider for tests.
- `github-copilot`: uses `@github/copilot-sdk` with ambient GitHub Copilot CLI auth.
- `codex`: uses `@openai/codex-sdk` with ambient Codex auth.

Default setup is empty for all real providers: no skills, no tools, no agent instructions, no env overrides, no working-directory fixtures.

Agent-eval library surface matches the UTK eval stack: `autoevals` for scoring and `@toon-format/toon` for TOON artifact compatibility.

## Commands

```bash
npm install
npm run typecheck
npm test
npm run build
```

Dry run:

```bash
npm run bench -- --provider mock
```

Benchmark runs write canonical latest results to `results/latest/scorecard.json` and `results/latest/scorecard.md` by default.

Live smoke runs are opt-in:

```bash
$env:TOKENMAXBENCH_LIVE_GITHUB_COPILOT='1'; npm test -- --run test/live.test.ts
$env:TOKENMAXBENCH_LIVE_CODEX='1'; npm test -- --run test/live.test.ts
```

Live benchmark:

```bash
npm run bench:github-copilot
npm run bench:codex
```
