# TokenMaxBench Agent Instructions

Repo purpose: run AgentV benchmark suites for token-reduction agent setups. No framework implementation or reusable library API belongs here.

Benchmark corpus:
- Active testcase definitions live in `evals/`.
- Custom grader and evaluator implementation code lives in `evaluators/`.
- Use AgentV `EVAL.yaml` suites, code graders, native assertions, and target config.
- Do not add root `src/` or `test/`.
- Do not add UTK package dependencies or runtime imports.
- Do not use non-AgentV agent-eval packages or reference runners.

Benchmark runs:
- Default benchmark runs both real providers: `npm run bench`.
- Provider-specific runs use ambient auth: `npm run bench:github-copilot` or `npm run bench:codex`.
- Agent provider grading uses `grader-openai`; keep `OPENAI_API_KEY` env-based.
- Canonical benchmark results live under `results/latest/`.

Validation:
- Run `npm run validate`, `npm run typecheck`, and `npm run bench` after benchmark changes.
- Keep provider-specific outputs under `results/github-copilot/` or `results/codex/`.
