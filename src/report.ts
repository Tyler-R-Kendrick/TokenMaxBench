import type { Scorecard } from './types.js';

export function renderMarkdownReport(scorecard: Scorecard): string {
  const rows = scorecard.results.map((result) => (
    `| ${result.id} | ${result.category} | ${result.outputTokens} | ${result.overallScore.toFixed(3)} | ${result.failures.length === 0 ? 'pass' : 'fail'} |`
  ));

  return [
    `# TokenMaxBench ${scorecard.provider.label} Report`,
    '',
    `Run: \`${scorecard.runId}\``,
    '',
    `Cases: ${scorecard.summary.caseCount}`,
    `Average score: ${scorecard.summary.averageOverallScore.toFixed(3)}`,
    `Total tokens: ${scorecard.summary.totalTokens}`,
    '',
    '| Case | Category | Output Tokens | Score | Status |',
    '| --- | --- | ---: | ---: | --- |',
    ...rows,
    ''
  ].join('\n');
}
