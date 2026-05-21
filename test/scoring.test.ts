import { describe, expect, it } from 'vitest';
import { scoreBenchmarkOutput } from '../src/scoring.js';
import type { BenchmarkCase } from '../src/types.js';

const baseCase: BenchmarkCase = {
  id: 'scoring-demo',
  title: 'Scoring demo',
  category: 'unit',
  input: 'input',
  expect: {
    requiredTerms: ['alpha', 'beta'],
    exactTerms: ['Exact Error'],
    orderedTerms: ['first', 'second', 'third'],
    forbiddenTerms: ['secret'],
    requiredPatterns: ['p95\\s+184ms'],
    forbiddenPatterns: ['0 vulnerabilities'],
    jsonFacts: [{ path: '$.status', expected: 'ok' }]
  },
  metadata: { sourceSuite: 'caveman' }
};

describe('scoreBenchmarkOutput', () => {
  it('scores full retention and no leakage', () => {
    const score = scoreBenchmarkOutput(baseCase, 'alpha beta Exact Error first second third p95 184ms {"status":"ok"}');

    expect(score.requiredTermRetentionScore).toBe(1);
    expect(score.exactTermRetentionScore).toBe(1);
    expect(score.orderedTermScore).toBe(1);
    expect(score.forbiddenLeakageScore).toBe(1);
    expect(score.requiredPatternScore).toBe(1);
    expect(score.forbiddenPatternScore).toBe(1);
    expect(score.jsonFactRetentionScore).toBe(1);
    expect(score.overallScore).toBe(1);
  });

  it('detects missing facts, exact drift, order drift, and forbidden leakage', () => {
    const score = scoreBenchmarkOutput(baseCase, 'alpha exact error second first secret p95 slow {"status":"failed"} 0 vulnerabilities');

    expect(score.requiredTermRetentionScore).toBe(0.5);
    expect(score.exactTermRetentionScore).toBe(0);
    expect(score.orderedTermScore).toBe(0);
    expect(score.forbiddenLeakageScore).toBe(0);
    expect(score.requiredPatternScore).toBe(0);
    expect(score.forbiddenPatternScore).toBe(0);
    expect(score.jsonFactRetentionScore).toBe(0);
    expect(score.failures.length).toBeGreaterThanOrEqual(6);
  });

  it('treats malformed patterns as failures instead of throwing', () => {
    const benchmark = {
      ...baseCase,
      expect: { ...baseCase.expect, requiredPatterns: ['([unterminated'], forbiddenPatterns: ['([unterminated'] }
    };

    const score = scoreBenchmarkOutput(benchmark, 'alpha beta Exact Error first second third {"status":"ok"}');

    expect(score.requiredPatternScore).toBe(0);
    expect(score.forbiddenPatternScore).toBe(0);
  });
});
