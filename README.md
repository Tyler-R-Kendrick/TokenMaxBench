# TokenMaxBench

AgentV-only benchmarks for measuring token-reduction agent setups.

This repo is only a benchmark project. It has no root `src/`, no root `test/`, and no reusable library API. Testcases live in `evals/`; custom grader and evaluator implementations live in `evaluators/`.

## Providers

- `grader-openai`: AgentV LLM grader target using `OPENAI_API_KEY`.
- `github-copilot`: AgentV Copilot target backed by `@github/copilot-sdk` and ambient Copilot auth.
- `codex`: AgentV Codex target backed by `@openai/codex-sdk` and ambient Codex auth.

## Commands

```bash
npm install
npm run validate
npm run typecheck
npm run bench
```

`npm run bench` requires `OPENAI_API_KEY` for AgentV's grader target plus ambient auth for the Copilot and Codex SDKs.

Provider-specific runs:

```bash
npm run bench:github-copilot
npm run bench:codex
```

Full benchmark results write to `results/latest/`. Provider-specific runs write under `results/github-copilot/latest/` and `results/codex/latest/`.

## Eval Layout

- `evals/**/*.EVAL.yaml`: AgentV suites and cases.
- `evaluators/**/*.ts`: custom AgentV code graders and shared evaluator helpers.
- `.agentv/targets.yaml`: AgentV target definitions.
- `agentv.config.ts`: AgentV execution and output defaults.
