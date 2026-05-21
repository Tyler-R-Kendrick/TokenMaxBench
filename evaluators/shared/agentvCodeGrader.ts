import { readFileSync } from 'node:fs';

export type AgentVCodeGraderInput = {
  input?: unknown;
  input_text?: string;
  inputText?: string;
  output?: unknown;
  output_text?: string;
  outputText?: string;
  expected_output?: unknown;
  expectedOutput?: unknown;
  expected_output_text?: string;
  expectedOutputText?: string;
  reference_answer?: string;
  referenceAnswer?: string;
};

export type RequiredFact =
  | { kind: 'literal'; value: string }
  | { kind: 'regex'; pattern: string }
  | { kind: 'jsonPath'; path: string; expected: unknown };

export type ExpectedPayload = {
  scenario?: string;
  required_terms?: string[];
  exact_terms?: string[];
  ordered_terms?: string[];
  forbidden_terms?: string[];
  required_patterns?: string[];
  forbidden_patterns?: string[];
  required_facts?: RequiredFact[];
  min_fact_score?: number;
  max_token_ratio?: number;
  caveman_tokens?: number;
  rtk_baseline_tokens?: number;
  compresr_baseline_tokens?: number;
  caveman_baseline?: string;
  compresr_baseline_text?: string;
};

export type Assertion = {
  name: string;
  text: string;
  passed: boolean;
  score: number;
};

export type GraderOutput = {
  score: number;
  assertions: Assertion[];
  reasoning: string;
  metadata: Record<string, unknown>;
};

export function readAgentVInput(): AgentVCodeGraderInput {
  return JSON.parse(readFileSync(0, 'utf8')) as AgentVCodeGraderInput;
}

export function expectedText(input: AgentVCodeGraderInput): string {
  return stringifyFirst(
    input.expected_output_text,
    input.expectedOutputText,
    input.expected_output,
    input.expectedOutput,
    input.reference_answer,
    input.referenceAnswer
  );
}

export function outputText(input: AgentVCodeGraderInput): string {
  return stringifyFirst(input.output_text, input.outputText, input.output);
}

export function inputText(input: AgentVCodeGraderInput): string {
  return stringifyFirst(input.input_text, input.inputText, input.input);
}

export function parseExpected(text: string): ExpectedPayload {
  const parsed = parseJsonObject(text);
  return parsed === undefined ? { caveman_baseline: text } : parsed as ExpectedPayload;
}

export function gradeExpectedPayload(expected: ExpectedPayload, candidate: string, tokenBudget?: number): GraderOutput {
  const assertions: Assertion[] = [];
  const scenario = expected.scenario ?? 'tokenmaxbench-agentv';
  addRatioAssertion(assertions, 'required-term-retention', 'required terms retained', ratio(countHits(expected.required_terms ?? [], (term) => containsTerm(candidate, term)), (expected.required_terms ?? []).length));
  addRatioAssertion(assertions, 'exact-term-retention', 'exact terms retained', ratio(countHits(expected.exact_terms ?? [], (term) => candidate.includes(term)), (expected.exact_terms ?? []).length));
  addRatioAssertion(assertions, 'required-pattern-retention', 'required patterns matched', ratio(countHits(expected.required_patterns ?? [], (pattern) => safeRegexTest(pattern, candidate)), (expected.required_patterns ?? []).length));
  addBooleanAssertion(assertions, 'ordered-terms', 'ordered terms preserved', orderedScore(candidate, expected.ordered_terms ?? []) === 1);
  addBooleanAssertion(assertions, 'forbidden-terms', 'forbidden terms absent', !(expected.forbidden_terms ?? []).some((term) => containsTerm(candidate, term)));
  addBooleanAssertion(assertions, 'forbidden-patterns', 'forbidden patterns absent', !(expected.forbidden_patterns ?? []).some((pattern) => !safeRegexIsValid(pattern) || safeRegexTest(pattern, candidate)));
  addRatioAssertion(assertions, 'required-facts', 'required facts retained', ratio(countHits(expected.required_facts ?? [], (fact) => factMatches(candidate, fact)), (expected.required_facts ?? []).length));

  if (tokenBudget !== undefined && tokenBudget > 0) {
    const maxRatio = expected.max_token_ratio ?? 1;
    const tokenCount = estimateTokens(candidate);
    addBooleanAssertion(assertions, 'token-budget', `estimated tokens ${tokenCount} <= ${Math.ceil(tokenBudget * maxRatio)}`, tokenCount <= Math.ceil(tokenBudget * maxRatio));
  }

  const score = round3(assertions.reduce((total, assertion) => total + assertion.score, 0) / assertions.length);
  const failed = assertions.filter((assertion) => !assertion.passed);
  return {
    score,
    assertions,
    reasoning: failed.length === 0 ? `${scenario}: all deterministic AgentV checks passed.` : failed.map((assertion) => assertion.text).join('\n'),
    metadata: {
      scenario,
      estimatedTokens: estimateTokens(candidate),
      minFactScore: expected.min_fact_score ?? 1
    }
  };
}

export function estimateTokens(text: string): number {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : Math.ceil(trimmed.length / 4);
}

function stringifyFirst(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string') return value;
    if (value !== undefined && value !== null) return JSON.stringify(value);
  }
  return '';
}

function countHits<T>(values: T[], predicate: (value: T) => boolean): number {
  return values.filter(predicate).length;
}

function containsTerm(output: string, term: string): boolean {
  return output.toLowerCase().includes(term.toLowerCase());
}

function ratio(hitCount: number, total: number): number {
  return total === 0 ? 1 : round3(hitCount / total);
}

function orderedScore(output: string, terms: string[]): number {
  if (terms.length <= 1) return 1;
  const lower = output.toLowerCase();
  let cursor = -1;
  for (const term of terms) {
    const index = lower.indexOf(term.toLowerCase(), cursor + 1);
    if (index === -1) return 0;
    cursor = index;
  }
  return 1;
}

function factMatches(output: string, fact: RequiredFact): boolean {
  if (fact.kind === 'literal') return containsTerm(output, fact.value);
  if (fact.kind === 'regex') return safeRegexTest(fact.pattern, output);
  return jsonFactMatches(output, fact.path, fact.expected);
}

function jsonFactMatches(output: string, path: string, expected: unknown): boolean {
  return parseJsonCandidates(output).some((candidate) => JSON.stringify(readJsonPath(candidate, path)) === JSON.stringify(expected));
}

function parseJsonCandidates(output: string): unknown[] {
  const candidates: unknown[] = [];
  const whole = parseJsonValue(output);
  if (whole !== undefined) candidates.push(whole);
  for (const [open, close] of [['{', '}'], ['[', ']']] as const) {
    for (let start = output.indexOf(open); start !== -1; start = output.indexOf(open, start + 1)) {
      for (let end = output.lastIndexOf(close); end > start; end = output.lastIndexOf(close, end - 1)) {
        const parsed = parseJsonValue(output.slice(start, end + 1));
        if (parsed !== undefined) {
          candidates.push(parsed);
          break;
        }
      }
    }
  }
  return candidates;
}

function parseJsonObject(text: string): Record<string, unknown> | undefined {
  const parsed = parseJsonValue(text);
  return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : undefined;
}

function parseJsonValue(text: string): unknown | undefined {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function readJsonPath(value: unknown, path: string): unknown {
  if (!path.startsWith('$')) return undefined;
  return pathTokens(path).reduce<unknown>((current, token) => {
    if (current === undefined || current === null) return undefined;
    if (typeof token === 'number') return Array.isArray(current) ? current[token] : undefined;
    return typeof current === 'object' ? (current as Record<string, unknown>)[token] : undefined;
  }, value);
}

function pathTokens(path: string): Array<string | number> {
  const tokens: Array<string | number> = [];
  let cursor = 1;
  while (cursor < path.length) {
    if (path[cursor] === '.') {
      cursor += 1;
      const start = cursor;
      while (cursor < path.length && path[cursor] !== '.' && path[cursor] !== '[') cursor += 1;
      tokens.push(path.slice(start, cursor));
    } else if (path[cursor] === '[') {
      const end = path.indexOf(']', cursor);
      if (end === -1) return tokens;
      tokens.push(Number(path.slice(cursor + 1, end)));
      cursor = end + 1;
    } else {
      return tokens;
    }
  }
  return tokens;
}

function safeRegexTest(pattern: string, output: string): boolean {
  try {
    return new RegExp(pattern).test(output);
  } catch {
    return false;
  }
}

function safeRegexIsValid(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

function addRatioAssertion(assertions: Assertion[], name: string, text: string, score: number): void {
  assertions.push({ name, text: `${text}: ${score.toFixed(3)}`, passed: score === 1, score });
}

function addBooleanAssertion(assertions: Assertion[], name: string, text: string, passed: boolean): void {
  assertions.push({ name, text, passed, score: passed ? 1 : 0 });
}

function round3(value: number): number {
  return Number(value.toFixed(3));
}
