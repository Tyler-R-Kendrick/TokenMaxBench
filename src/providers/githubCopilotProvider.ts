import { approveAll, CopilotClient, type CopilotClientOptions } from '@github/copilot-sdk';
import { estimateTokens } from '../tokens.js';
import { EMPTY_SETUP, type BenchmarkProvider, type HarnessSetup } from '../types.js';

export type GitHubCopilotProviderOptions = {
  model?: string;
  timeoutMs?: number;
  clientOptions?: CopilotClientOptions;
  workingDirectory?: string;
  setup?: Partial<HarnessSetup>;
};

export function createGitHubCopilotProvider(options: GitHubCopilotProviderOptions = {}): BenchmarkProvider {
  const setup = mergeSetup(options.setup);
  return {
    id: 'github-copilot',
    label: 'GitHub Copilot SDK',
    setup,
    async run(input) {
      const client = new CopilotClient(options.clientOptions);
      const session = await client.createSession({
        onPermissionRequest: approveAll,
        model: options.model,
        workingDirectory: options.workingDirectory ?? process.cwd(),
        tools: []
      });
      try {
        const response = await session.sendAndWait({ prompt: input.prompt }, options.timeoutMs ?? 120000);
        const output = response?.data.content ?? '';
        const outputTokens = response?.data.outputTokens ?? estimateTokens(output);
        return {
          output,
          usage: {
            inputTokens: estimateTokens(input.prompt),
            outputTokens,
            totalTokens: estimateTokens(input.prompt) + outputTokens
          },
          metadata: {
            model: response?.data.model ?? options.model ?? null,
            messageId: response?.data.messageId ?? null,
            requestId: response?.data.requestId ?? null
          }
        };
      } finally {
        await session.disconnect().catch(() => undefined);
        await client.stop().catch(() => []);
      }
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
