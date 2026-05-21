import {
  expectedText,
  gradeExpectedPayload,
  outputText,
  parseExpected,
  readAgentVInput
} from '../../shared/agentvCodeGrader.js';

const input = readAgentVInput();
const expected = parseExpected(expectedText(input));
const tokenBudget = expected.caveman_tokens;
const result = gradeExpectedPayload(expected, outputText(input), tokenBudget);

console.log(JSON.stringify(result));
