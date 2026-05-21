import {
  expectedText,
  gradeExpectedPayload,
  outputText,
  parseExpected,
  readAgentVInput
} from '../../../shared/agentvCodeGrader.js';

const input = readAgentVInput();
const expected = parseExpected(expectedText(input));
if (typeof expected.rtk_baseline_tokens !== 'number' || !Number.isFinite(expected.rtk_baseline_tokens)) {
  console.log(JSON.stringify({
    score: 0,
    assertions: [],
    reasoning: 'Invalid or missing rtk_baseline_tokens in expected payload',
    metadata: { error: 'rtk_baseline_tokens must be a finite number' }
  }));
  process.exit(0);
}
const tokenBudget = expected.rtk_baseline_tokens;
const result = gradeExpectedPayload(expected, outputText(input), tokenBudget);

console.log(JSON.stringify(result));
