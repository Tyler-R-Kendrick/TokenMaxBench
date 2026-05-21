import { JSONDiff } from 'autoevals';
import type { BenchmarkCase, BenchmarkScores, JsonFact } from './types.js';

export async function scoreBenchmarkOutput(benchmark: BenchmarkCase, output: string): Promise<BenchmarkScores> {
  const requiredTermRetentionScore = ratio(countHits(benchmark.expect.requiredTerms, (term) => containsTerm(output, term)), benchmark.expect.requiredTerms.length);
  const exactTermRetentionScore = ratio(countHits(benchmark.expect.exactTerms ?? [], (term) => output.includes(term)), benchmark.expect.exactTerms?.length ?? 0);
  const orderedTermScore = orderedScore(output, benchmark.expect.orderedTerms ?? []);
  const forbiddenLeakageScore = forbiddenTermsScore(output, benchmark.expect.forbiddenTerms ?? []);
  const requiredPatternScore = ratio(countHits(benchmark.expect.requiredPatterns ?? [], (pattern) => safeRegexTest(pattern, output)), benchmark.expect.requiredPatterns?.length ?? 0);
  const forbiddenPatternScore = forbiddenPatternsScore(output, benchmark.expect.forbiddenPatterns ?? []);
  const jsonFactRetentionScore = ratio(countHits(benchmark.expect.jsonFacts, (fact) => jsonFactMatches(output, fact)), benchmark.expect.jsonFacts.length);
  const autoevalsFactScore = await scoreAutoevalsFacts(benchmark, output);

  const parts = [
    requiredTermRetentionScore,
    exactTermRetentionScore,
    orderedTermScore,
    forbiddenLeakageScore,
    requiredPatternScore,
    forbiddenPatternScore,
    jsonFactRetentionScore,
    autoevalsFactScore
  ];
  const failures = buildFailures({
    requiredTermRetentionScore,
    exactTermRetentionScore,
    orderedTermScore,
    forbiddenLeakageScore,
    requiredPatternScore,
    forbiddenPatternScore,
    jsonFactRetentionScore,
    autoevalsFactScore
  });

  return {
    requiredTermRetentionScore,
    exactTermRetentionScore,
    orderedTermScore,
    forbiddenLeakageScore,
    requiredPatternScore,
    forbiddenPatternScore,
    jsonFactRetentionScore,
    autoevalsFactScore,
    overallScore: round3(parts.reduce((sum, value) => sum + value, 0) / parts.length),
    failures
  };
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

function forbiddenTermsScore(output: string, terms: string[]): number {
  if (terms.length === 0) return 1;
  return terms.some((term) => containsTerm(output, term)) ? 0 : 1;
}

function forbiddenPatternsScore(output: string, patterns: string[]): number {
  if (patterns.length === 0) return 1;
  return patterns.some((pattern) => !safeRegexIsValid(pattern) || safeRegexTest(pattern, output)) ? 0 : 1;
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

function jsonFactMatches(output: string, fact: JsonFact): boolean {
  for (const value of parseJsonCandidates(output)) {
    if (JSON.stringify(readJsonPath(value, fact.path)) === JSON.stringify(fact.expected)) {
      return true;
    }
  }
  return false;
}

async function scoreAutoevalsFacts(benchmark: BenchmarkCase, output: string): Promise<number> {
  const expected = buildAutoevalsFactVector(benchmark, () => true);
  if (Object.keys(expected.requiredTerms).length === 0
    && Object.keys(expected.exactTerms).length === 0
    && Object.keys(expected.jsonFacts).length === 0) {
    return 1;
  }

  const actual = buildAutoevalsFactVector(benchmark, (kind, value) => {
    if (kind === 'requiredTerms') return containsTerm(output, value);
    if (kind === 'exactTerms') return output.includes(value);
    return jsonFactMatches(output, JSON.parse(value) as JsonFact);
  });
  const score = await JSONDiff({ output: actual, expected, preserveStrings: true });
  return round3(score.score ?? 0);
}

function buildAutoevalsFactVector(
  benchmark: BenchmarkCase,
  retained: (kind: 'requiredTerms' | 'exactTerms' | 'jsonFacts', value: string) => boolean
): Record<'requiredTerms' | 'exactTerms' | 'jsonFacts', Record<string, boolean>> {
  return {
    requiredTerms: Object.fromEntries(benchmark.expect.requiredTerms.map((term) => [term, retained('requiredTerms', term)])),
    exactTerms: Object.fromEntries((benchmark.expect.exactTerms ?? []).map((term) => [term, retained('exactTerms', term)])),
    jsonFacts: Object.fromEntries(benchmark.expect.jsonFacts.map((fact) => [JSON.stringify(fact), retained('jsonFacts', JSON.stringify(fact))]))
  };
}

function parseJsonCandidates(output: string): unknown[] {
  const candidates: unknown[] = [];
  for (const [open, close] of [['{', '}'], ['[', ']']] as const) {
    for (let start = output.indexOf(open); start !== -1; start = output.indexOf(open, start + 1)) {
      for (let end = output.lastIndexOf(close); end > start; end = output.lastIndexOf(close, end - 1)) {
        try {
          candidates.push(JSON.parse(output.slice(start, end + 1)));
          break;
        } catch {
          // Try shorter candidate.
        }
      }
    }
  }
  return candidates;
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

function buildFailures(scores: Omit<BenchmarkScores, 'overallScore' | 'failures'>): string[] {
  return Object.entries(scores)
    .filter(([, value]) => value < 1)
    .map(([name, value]) => `${name}=${value}`);
}

function round3(value: number): number {
  return Number(value.toFixed(3));
}
