import type { BenchmarkCase } from '../src/types.js';

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'shell-git-status',
    title: 'Git status summary',
    category: 'Shell output',
    input: 'Summarize this git status output without losing modified or untracked file facts:\n\n M README.md\n?? packages/evals/fixtures/rtkParityFixtures.ts\n?? packages/evals/metrics/rtkParityMetrics.ts',
    expect: {
      requiredTerms: ['M README.md', 'rtkParityFixtures.ts'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'rtk',
      sourceFixture: 'shell-git-status',
      sourcePath: 'evals/benchmarks.ts#shell-git-status'
    }
  },
  {
    id: 'shell-pytest-failure',
    title: 'Pytest failure summary',
    category: 'Test output',
    input: 'Summarize this pytest failure with failing test and expected schema:\n\nFAILED tests/test_router.py::test_schema_route - AssertionError: expected schema shell.git-status.v1\nE assert "fallback.v1" == "shell.git-status.v1"\n1 failed, 12 passed in 3.14s',
    expect: {
      requiredTerms: ['tests/test_router.py::test_schema_route', 'expected schema shell.git-status.v1'],
      exactTerms: ['shell.git-status.v1'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'rtk',
      sourceFixture: 'shell-pytest-failure',
      sourcePath: 'evals/benchmarks.ts#shell-pytest-failure'
    }
  },
  {
    id: 'provider-adapter-openai-tool-call',
    title: 'OpenAI tool-call adapter facts',
    category: 'Provider adapters',
    input: 'Extract provider adapter facts from this tool message JSON:\n\n{"messages":[{"role":"tool","tool_call_id":"call_123","content":"{\\"status\\":\\"failed\\",\\"shard\\":\\"win\\"}"}]}',
    expect: {
      requiredTerms: ['tool_call_id', 'call_123', 'tool'],
      jsonFacts: [
        { path: '$.messages[0].tool_call_id', expected: 'call_123' },
        { path: '$.messages[0].role', expected: 'tool' }
      ]
    },
    metadata: {
      sourceSuite: 'compresr',
      sourceFixture: 'provider-adapter-openai-tool-call',
      sourcePath: 'evals/benchmarks.ts#provider-adapter-openai-tool-call'
    }
  },
  {
    id: 'chunking-exact-error',
    title: 'Exact Windows error retention',
    category: 'Exact diagnostics',
    input: 'Summarize only the relevant paragraph and preserve the exact Windows error:\n\nparagraph 6: ERROR Cannot read directory "../../../../..": Access is denied.',
    expect: {
      requiredTerms: ['Cannot read directory', 'Access is denied', 'paragraph 6'],
      exactTerms: ['Cannot read directory "../../../../..": Access is denied.'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'compresr',
      sourceFixture: 'heuristic-chunking-boundary',
      sourcePath: 'evals/benchmarks.ts#chunking-exact-error'
    }
  },
  {
    id: 'ci-failure-triage',
    title: 'CI failure triage',
    category: 'Technical summary',
    input: 'The CI run is failing during the typecheck step. The command was npm run typecheck. TypeScript reports TS2345 in packages/core/src/router/router.ts on line 87 because schemaId may be undefined. The next action is to guard schemaId before calling routeToSchema(schemaId), then rerun npm run typecheck.',
    expect: {
      requiredTerms: ['npm run typecheck', 'TS2345', 'packages/core/src/router/router.ts', 'schemaId', 'routeToSchema(schemaId)'],
      exactTerms: ['TS2345'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'caveman',
      sourceFixture: 'ci-failure-triage',
      sourcePath: 'evals/benchmarks.ts#ci-failure-triage'
    }
  },
  {
    id: 'destructive-migration-warning',
    title: 'Destructive migration order',
    category: 'Safety clarity',
    input: 'Dropping the legacy_events.payload column is irreversible after the migration is applied. The operator must take a backup, run the migration, verify row counts, and only then delete the backup.',
    expect: {
      requiredTerms: ['irreversible', 'backup', 'migrate', 'verify', 'delete backup'],
      orderedTerms: ['backup', 'migration', 'verify', 'delete the backup'],
      forbiddenTerms: ['safe to skip backup'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'caveman',
      sourceFixture: 'destructive-migration-warning',
      sourcePath: 'evals/benchmarks.ts#destructive-migration-warning'
    }
  },
  {
    id: 'leanctx-copilot-tool-output',
    title: 'Copilot tool output retention',
    category: 'Copilot tool output',
    input: 'Summarize this Copilot postToolUse output with diagnostic path retained:\n\nFAIL packages/core/test/contextOptimization.test.ts\nerror TS2322\npackages/core/src/contextOptimization/contextOptimization.ts:402\nnoise repeated repeated repeated',
    expect: {
      requiredTerms: ['FAIL packages/core/test/contextOptimization.test.ts', 'error TS2322', 'packages/core/src/contextOptimization/contextOptimization.ts:402'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'leanctx',
      sourceFixture: 'tool-vitest-fail',
      sourcePath: 'evals/benchmarks.ts#leanctx-copilot-tool-output'
    }
  },
  {
    id: 'bash-ripgrep-command',
    title: 'Bash command rewrite',
    category: 'Command parsing',
    input: 'Convert request to exact command: rg search packages -g *.ts for mediateToolExecution',
    expect: {
      requiredTerms: ['rg', 'mediateToolExecution', 'packages', '-g', '*.ts'],
      exactTerms: ['rg mediateToolExecution packages -g *.ts'],
      jsonFacts: []
    },
    metadata: {
      sourceSuite: 'bash',
      sourceFixture: 'ripgrep-typescript-symbol',
      sourcePath: 'evals/benchmarks.ts#bash-ripgrep-command'
    }
  }
];

export function createBenchmarkPrompt(benchmark: BenchmarkCase): string {
  const requirements = [
    ...benchmark.expect.requiredTerms.map((term) => `- include required term: ${term}`),
    ...(benchmark.expect.exactTerms ?? []).map((term) => `- preserve exact text: ${term}`),
    ...(benchmark.expect.forbiddenTerms ?? []).map((term) => `- avoid forbidden term: ${term}`)
  ].join('\n');

  return [
    'Return concise answer for benchmark workload.',
    'Do not mention TokenMaxBench scoring.',
    'Preserve required facts. Avoid unsupported details.',
    '',
    'Workload:',
    benchmark.input,
    '',
    'Expectations:',
    requirements || '- no extra expectations'
  ].join('\n');
}
