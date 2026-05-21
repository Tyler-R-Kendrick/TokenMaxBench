# TokenMaxBench

Framework-neutral benchmarks for measuring token-reduction agent setups.

This repo starts with copied UTK benchmark assets under `vendor/utk-evals` for provenance. The active harness uses neutral benchmark cases in `src/fixtures.ts` and records metrics instead of asserting that one framework beats another.

## Providers

- `mock`: deterministic dry-run provider for tests.
- `github-copilot`: uses `@github/copilot-sdk` with ambient GitHub Copilot CLI auth.
- `codex`: uses `@openai/codex-sdk` with ambient Codex auth.

Default setup is empty for all real providers: no skills, no tools, no agent instructions, no env overrides, no working-directory fixtures.

## Commands

```bash
npm install
npm run typecheck
npm test
npm run build
```

Dry run:

```bash
npm run bench -- --provider mock --output reports/mock.json
```

Live smoke runs are opt-in:

```bash
$env:TOKENMAXBENCH_LIVE_GITHUB_COPILOT='1'; npm test -- --run test/live.test.ts
$env:TOKENMAXBENCH_LIVE_CODEX='1'; npm test -- --run test/live.test.ts
```

Live benchmark:

```bash
npm run bench:github-copilot -- --output reports/github-copilot.json
npm run bench:codex -- --output reports/codex.json
```
