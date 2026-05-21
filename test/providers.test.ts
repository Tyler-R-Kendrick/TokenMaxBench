import { describe, expect, it } from 'vitest';
import { createCodexProvider } from '../src/providers/codexProvider.js';
import { createGitHubCopilotProvider } from '../src/providers/githubCopilotProvider.js';
import { createMockProvider } from '../src/providers/mockProvider.js';

describe('providers', () => {
  it('records empty default setup for GitHub Copilot and Codex providers', () => {
    expect(createGitHubCopilotProvider().setup).toEqual({
      skills: [],
      tools: [],
      agentInstructions: [],
      env: {},
      workingDirectoryFixtures: []
    });
    expect(createCodexProvider().setup).toEqual({
      skills: [],
      tools: [],
      agentInstructions: [],
      env: {},
      workingDirectoryFixtures: []
    });
  });

  it('mock provider returns deterministic output for dry integration tests', async () => {
    const provider = createMockProvider('alpha beta');
    const result = await provider.run({
      case: {
        id: 'mock',
        title: 'Mock',
        category: 'unit',
        input: 'input',
        expect: { requiredTerms: ['alpha'], jsonFacts: [] },
        metadata: { sourceSuite: 'bash' }
      },
      prompt: 'prompt',
      runId: 'run-1'
    });

    expect(result.output).toContain('alpha beta');
    expect(result.usage.outputTokens).toBeGreaterThan(0);
  });
});
