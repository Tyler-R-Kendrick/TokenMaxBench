# TokenMaxBench Agent Instructions

Repo purpose: run token-reduction benchmark workloads and store scorecards. No framework implementation belongs here.

Benchmark corpus:
- Active benchmark definitions live only in `evals/benchmarks.ts`.
- `evals/` contains benchmarks only. Do not put reports, harness code, fixtures, or vendored UTK eval packages there.
- Do not recreate `vendor/utk-evals`.

Benchmark runs:
- Whenever running benchmarks, update `results/latest/scorecard.json` and `results/latest/scorecard.md`.
- Default command writes canonical latest results: `npm run bench -- --provider mock`.
- Live providers stay opt-in and use ambient auth: `npm run bench:github-copilot` or `npm run bench:codex`.
- If using custom `--output`, also refresh canonical `results/latest/` before finishing.

Validation:
- Run `npm test`, `npm run typecheck`, and `npm run build` after harness or benchmark changes.
- Keep live SDK tests gated by `TOKENMAXBENCH_LIVE_GITHUB_COPILOT=1` and `TOKENMAXBENCH_LIVE_CODEX=1`.
