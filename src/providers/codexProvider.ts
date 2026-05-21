import { Codex, type CodexOptions, type ThreadOptions } from '@openai/codex-sdk';
import { estimateTokens } from '../tokens.js';
import { EMPTY_SETUP, type BenchmarkProvider, type HarnessSetup } from '../types.js';

export type CodexProviderOptions = {
  codexOptions?: CodexOptions;
  threadOptions?: ThreadOptions;
  setup?: Partial<HarnessSetup>;
};

export function createCodexProvider(options: CodexProviderOptions = {}): BenchmarkProvider {
  const setup = mergeSetup(options.setup);
  return {
    id: 'codex',
    label: 'Codex SDK',
    setup,
    async run(input) {
      const codex = new Codex(options.codexOptions);
      const thread = codex.startThread({
        workingDirectory: process.cwd(),
        skipGitRepoCheck: true,
        sandboxMode: 'read-only',
        approvalPolicy: 'never',
        ...options.threadOptions
      });
      const result = await thread.run(input.prompt);
      const output = result.finalResponse;
      return {
        output,
        usage: {
          inputTokens: result.usage?.input_tokens ?? estimateTokens(input.prompt),
          outputTokens: result.usage?.output_tokens ?? estimateTokens(output),
          totalTokens: (result.usage?.input_tokens ?? estimateTokens(input.prompt)) + (result.usage?.output_tokens ?? estimateTokens(output))
        },
        metadata: {
          threadId: thread.id,
          itemCount: result.items.length
        }
      };
    }
  };
}

function mergeSetup(setup: Partial<HarnessSetup> | undefined): HarnessSetup {
  return {
    skills: setup?.skills ?? [],
    tools: setup?.tools ?? [],
    agentInstructions: setup?.agentInstructions ?? [],
    env: setup?.env ?? {},
    workingDirectoryFixtures: setup?.workingDirectoryFixtures ?? []
  };
}
