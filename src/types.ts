export type SourceSuite = 'rtk' | 'compresr' | 'caveman' | 'leanctx' | 'bash';

export type JsonFact = {
  path: string;
  expected: unknown;
};

export type BenchmarkExpectation = {
  requiredTerms: string[];
  jsonFacts: JsonFact[];
  exactTerms?: string[];
  orderedTerms?: string[];
  forbiddenTerms?: string[];
  requiredPatterns?: string[];
  forbiddenPatterns?: string[];
};

export type BenchmarkCase = {
  id: string;
  title: string;
  category: string;
  input: string;
  expect: BenchmarkExpectation;
  metadata: {
    sourceSuite: SourceSuite;
    sourceFixture?: string;
    sourcePath?: string;
    notes?: string;
    frameworkBaseline?: never;
  };
};

export type HarnessSetup = {
  skills: string[];
  tools: string[];
  agentInstructions: string[];
  env: Record<string, string>;
  workingDirectoryFixtures: string[];
};

export type ProviderUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type BenchmarkProviderResult = {
  output: string;
  usage: ProviderUsage;
  metadata?: Record<string, unknown>;
};

export type BenchmarkProviderRunInput = {
  case: BenchmarkCase;
  prompt: string;
  runId: string;
};

export type BenchmarkProvider = {
  id: string;
  label: string;
  setup: HarnessSetup;
  run(input: BenchmarkProviderRunInput): Promise<BenchmarkProviderResult>;
};

export type BenchmarkRunConfig = {
  provider: BenchmarkProvider;
  cases: BenchmarkCase[];
  runId?: string;
};

export type BenchmarkScores = {
  requiredTermRetentionScore: number;
  exactTermRetentionScore: number;
  orderedTermScore: number;
  forbiddenLeakageScore: number;
  requiredPatternScore: number;
  forbiddenPatternScore: number;
  jsonFactRetentionScore: number;
  autoevalsFactScore: number;
  overallScore: number;
  failures: string[];
};

export type BenchmarkResult = BenchmarkScores & {
  id: string;
  title: string;
  category: string;
  output: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  outputChars: number;
  outputBytes: number;
  providerMetadata?: Record<string, unknown>;
};

export type Scorecard = {
  runId: string;
  createdAt: string;
  provider: {
    id: string;
    label: string;
    setup: HarnessSetup;
  };
  results: BenchmarkResult[];
  summary: {
    caseCount: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    averageLatencyMs: number;
    averageOverallScore: number;
    failedCaseCount: number;
  };
};

export const EMPTY_SETUP: HarnessSetup = {
  skills: [],
  tools: [],
  agentInstructions: [],
  env: {},
  workingDirectoryFixtures: []
};
