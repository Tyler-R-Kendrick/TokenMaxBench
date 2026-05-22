import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type TargetId = "mock";
type TechniqueFamily = "compaction" | "selection" | "rewriting";
type TechniqueSurface =
  | "input"
  | "output"
  | "tool"
  | "skill"
  | "agent"
  | "handoff"
  | "system-prompt";

type ScenarioInput = {
  prompt: string;
  system_prompt?: string;
  tool_definitions?: Array<{
    name: string;
    description: string;
    input_schema?: Record<string, unknown>;
  }>;
  skills?: Array<{
    name: string;
    description: string;
    body: string;
  }>;
  agents?: Array<{
    name: string;
    description: string;
    instructions: string;
  }>;
  handoffs?: Array<{
    from: string;
    to: string;
    condition: string;
  }>;
  tool_output?: string;
};

type Scenario = {
  id: string;
  technique_family: TechniqueFamily;
  technique_surface: TechniqueSurface;
  technique_mode: "none";
  input: ScenarioInput;
};

type BaselineData = {
  generatedBy: "grounding-baseline";
  targets: Array<{
    id: TargetId;
    sdk: "mock";
    agentvTarget: "mock";
  }>;
  scenarios: Scenario[];
  runs: BaselineRun[];
};

type BaselineRun = {
  target: TargetId;
  scenario_id: string;
  technique_family: TechniqueFamily;
  technique_surface: TechniqueSurface;
  technique_mode: "none";
  input: ScenarioInput;
  sdk_run: {
    command: string[];
    exit_code: number;
    stdout: string;
    stderr: string;
    duration_ms: number;
  };
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  tool_calls: Array<{ name: string; args: Record<string, unknown> }>;
  selected_skills: string[];
  selected_agents: string[];
  handoffs: Array<{ from: string; to: string; reason: string }>;
  artifacts: Array<{ name: string; content: string }>;
  errors: string[];
};

const targets: BaselineData["targets"] = [
  { id: "mock", sdk: "mock", agentvTarget: "mock" }
];

const scenarios: Scenario[] = [
  scenario({
    id: "compaction-input",
    technique_family: "compaction",
    technique_surface: "input",
    input: {
      prompt: [
        "Read long project instructions, package constraints, and benchmark notes.",
        "Summarize implementation constraints for future input compaction.",
        "Preserve exact file paths, exported symbol names, token budget numbers, and unresolved questions.",
        "Do not apply compaction. Capture full clean-run behavior for baseline grounding."
      ].join("\n")
    }
  }),
  scenario({
    id: "compaction-output",
    technique_family: "compaction",
    technique_surface: "output",
    input: {
      prompt: [
        "Given verbose tool output below, produce maintainer-facing summary with exact failing command, failing package, and next fix.",
        "Do not compress output through any benchmark technique. Capture normal SDK response shape."
      ].join("\n"),
      tool_output: [
        "> npm run validate",
        "FAIL evals/grounding.EVAL.yaml",
        "Expected first-party grounding fixtures, found legacy comparison import.",
        "Expected targets [mock], found legacy SDK targets."
      ].join("\n")
    }
  }),
  scenario({
    id: "selection-tool",
    technique_family: "selection",
    technique_surface: "tool",
    input: {
      prompt:
        "Inspect README.md and package.json, then report package name and available benchmark scripts.",
      tool_definitions: [
        {
          name: "read_file",
          description: "Read UTF-8 file contents from workspace.",
          input_schema: {
            type: "object",
            required: ["path"],
            properties: { path: { type: "string" } }
          }
        },
        {
          name: "run_tests",
          description: "Run package test command and return exit code plus output.",
          input_schema: {
            type: "object",
            required: ["command"],
            properties: { command: { type: "string" } }
          }
        }
      ]
    }
  }),
  scenario({
    id: "selection-skill",
    technique_family: "selection",
    technique_surface: "skill",
    input: {
      prompt:
        "Create narrow TDD plan for adding grounding fixtures without touching unrelated eval suites.",
      skills: [
        {
          name: "benchmark",
          description:
            "Use repo conventions for AgentV evals, benchmark results, package scripts, and generated data.",
          body:
            "Prefer AgentV-native fixtures, strict baseline data shape, root data artifacts, and generated docs committed only after passing validation."
        },
        {
          name: "detoks",
          description: "Design token-saving skill split with compact entrypoint and references.",
          body: "Use only when optimizing skill instruction payloads or measuring token savings."
        }
      ]
    }
  }),
  scenario({
    id: "selection-agent",
    technique_family: "selection",
    technique_surface: "agent",
    input: {
      prompt:
        "Choose best specialist agent to update eval fixtures and explain why, then provide next implementation step.",
      agents: [
        {
          name: "benchmark-maintainer",
          description: "Maintains AgentV benchmark suites and persisted baseline data.",
          instructions:
            "Inspect evals, target config, generated data, and result conventions before editing."
        },
        {
          name: "docs-maintainer",
          description: "Maintains README and explanatory benchmark docs.",
          instructions:
            "Prefer docs-only changes unless benchmark data contract already exists."
        }
      ]
    }
  }),
  scenario({
    id: "selection-handoff",
    technique_family: "selection",
    technique_surface: "handoff",
    input: {
      prompt:
        "Plan fixture rewrite, hand off implementation, then hand off review when code and generated artifacts exist.",
      agents: [
        {
          name: "planner",
          description: "Breaks benchmark work into ordered implementation steps.",
          instructions: "Stop after acceptance criteria and file list are clear."
        },
        {
          name: "implementer",
          description: "Edits AgentV fixtures, scripts, and generated artifacts.",
          instructions: "Run focused validation after edits."
        },
        {
          name: "reviewer",
          description:
            "Checks diff for external suite references, target drift, and missing artifact regeneration.",
          instructions: "Return only blocking findings."
        }
      ],
      handoffs: [
        { from: "planner", to: "implementer", condition: "Implementation file list is known." },
        { from: "implementer", to: "reviewer", condition: "Validation and data generation complete." }
      ]
    }
  }),
  scenario({
    id: "rewriting-skill",
    technique_family: "rewriting",
    technique_surface: "skill",
    input: {
      prompt:
        "Rewrite verbose skill instructions into a concise skill while preserving triggers, workflow, and constraints.",
      skills: [
        {
          name: "fixture-author",
          description: "Verbose skill source for baseline rewrite capture.",
          body: [
            "When asked to author grounding data, first identify the technique family and surface.",
            "Then create one fixture that exercises target behavior without applying optimization techniques.",
            "Keep scenario input explicit enough that future AgentV graders can compare tool calls, skill selection, agent routing, handoffs, and prompt rewrites."
          ].join(" ")
        }
      ]
    }
  }),
  scenario({
    id: "rewriting-agent",
    technique_family: "rewriting",
    technique_surface: "agent",
    input: {
      prompt:
        "Rewrite agent instructions for a baseline-capture worker. Preserve scope and fail-fast behavior.",
      agents: [
        {
          name: "baseline-capture-worker",
          description: "Runs first-party grounding scenarios.",
          instructions: [
            "Execute each scenario through configured SDK target.",
            "Capture transcript, selected tools, selected skills, selected agents, handoffs, artifacts, and errors.",
            "Do not score accuracy or compare compaction techniques.",
            "Fail run if target cannot execute."
          ].join(" ")
        }
      ]
    }
  }),
  scenario({
    id: "rewriting-system-prompt",
    technique_family: "rewriting",
    technique_surface: "system-prompt",
    input: {
      prompt: "Rewrite system prompt for lower ambiguity while preserving all behavioral constraints.",
      system_prompt: [
        "You are baseline runner.",
        "Use technique_mode none only.",
        "Capture SDK behavior for compaction, selection, and rewriting surfaces.",
        "Do not grade, optimize, compact, or compare external tools.",
        "Return structured baseline data suitable for future AgentV evaluators."
      ].join("\n")
    }
  })
];

async function main(): Promise<void> {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const data = buildBaselineData();
  const dataRoot = path.join(root, "data");
  const scenarioRoot = path.join(dataRoot, "scenarios");

  await mkdir(scenarioRoot, { recursive: true });
  await writeFile(
    path.join(dataRoot, "baseline.json"),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  );
  await writeFile(
    path.join(dataRoot, "README.md"),
    renderSummaryMarkdown(data),
    "utf8"
  );

  for (const scenarioData of data.scenarios) {
    await writeFile(
      path.join(scenarioRoot, `${safeFileName(scenarioData.id)}.md`),
      renderScenarioMarkdown(data, scenarioData),
      "utf8"
    );
  }

  process.stdout.write(renderSummaryMarkdown(data));
}

function buildBaselineData(): BaselineData {
  return {
    generatedBy: "grounding-baseline",
    targets,
    scenarios,
    runs: scenarios.flatMap((scenarioData) =>
      targets.map((target) => captureMockRun(target.id, scenarioData))
    )
  };
}

function captureMockRun(target: TargetId, scenarioData: Scenario): BaselineRun {
  const tool_calls =
    scenarioData.technique_surface === "tool"
      ? [
          { name: "read_file", args: { path: "README.md" } },
          { name: "read_file", args: { path: "package.json" } }
        ]
      : [];
  const selected_skills =
    scenarioData.technique_surface === "skill"
      ? [scenarioData.input.skills?.[0]?.name ?? "benchmark"]
      : [];
  const selected_agents =
    scenarioData.technique_surface === "agent"
      ? [scenarioData.input.agents?.[0]?.name ?? "benchmark-maintainer"]
      : scenarioData.technique_surface === "handoff"
        ? scenarioData.input.agents?.map((agent) => agent.name) ?? []
        : [];
  const handoffs =
    scenarioData.technique_surface === "handoff"
      ? (scenarioData.input.handoffs ?? []).map((handoff) => ({
          from: handoff.from,
          to: handoff.to,
          reason: handoff.condition
        }))
      : [];

  return {
    target,
    scenario_id: scenarioData.id,
    technique_family: scenarioData.technique_family,
    technique_surface: scenarioData.technique_surface,
    technique_mode: scenarioData.technique_mode,
    input: scenarioData.input,
    sdk_run: {
      command: [
        "agentv",
        "eval",
        "evals/",
        "--target",
        target,
        "--test-id",
        scenarioData.id,
        "--json"
      ],
      exit_code: 0,
      stdout: JSON.stringify({
        ok: true,
        target,
        scenario: scenarioData.id,
        technique_family: scenarioData.technique_family,
        technique_surface: scenarioData.technique_surface,
        technique_mode: scenarioData.technique_mode
      }),
      stderr: "",
      duration_ms: 1
    },
    transcript: [
      { role: "user", content: scenarioData.input.prompt },
      { role: "assistant", content: `baseline ${target} ${scenarioData.id}` }
    ],
    tool_calls,
    selected_skills,
    selected_agents,
    handoffs,
    artifacts: [
      {
        name: `${safeFileName(scenarioData.id)}.${target}.json`,
        content: JSON.stringify({
          target,
          scenario_id: scenarioData.id,
          technique_family: scenarioData.technique_family,
          technique_surface: scenarioData.technique_surface,
          technique_mode: scenarioData.technique_mode,
          tool_calls,
          selected_skills,
          selected_agents,
          handoffs
        })
      }
    ],
    errors: []
  };
}

function renderSummaryMarkdown(data: BaselineData): string {
  const bySurface = new Map<string, number>();
  for (const scenarioData of data.scenarios) {
    const key = `${scenarioData.technique_family}/${scenarioData.technique_surface}`;
    bySurface.set(key, (bySurface.get(key) ?? 0) + 1);
  }

  return `${[
    "# Grounding Baseline Data",
    "",
    "Generated from first-party mock target captures with technique_mode none.",
    "",
    "## Summary",
    "",
    `- Targets: ${data.targets.map((target) => target.id).join(", ")}`,
    `- Scenarios: ${data.scenarios.length}`,
    `- Runs: ${data.runs.length}`,
    "",
    "## Technique Coverage",
    "",
    "| Family | Surface | Scenarios |",
    "| --- | --- | ---: |",
    ...[...bySurface.entries()].map(([key, count]) => {
      const [family, surface] = key.split("/");
      return `| ${family} | ${surface} | ${count} |`;
    }),
    ""
  ].join("\n")}\n`;
}

function renderScenarioMarkdown(data: BaselineData, scenarioData: Scenario): string {
  const runs = data.runs.filter((run) => run.scenario_id === scenarioData.id);
  const lines = [
    `# ${scenarioData.id}`,
    "",
    "## Scenario",
    "",
    `- Technique family: ${scenarioData.technique_family}`,
    `- Technique surface: ${scenarioData.technique_surface}`,
    `- Technique mode: ${scenarioData.technique_mode}`,
    `- Targets: ${runs.map((run) => run.target).join(", ")}`,
    "",
    "## Input",
    "",
    "```json",
    JSON.stringify(scenarioData.input, null, 2),
    "```",
    "",
    "## Captured Runs",
    ""
  ];

  for (const run of runs) {
    lines.push(
      `### ${run.target}`,
      "",
      `- Exit code: ${run.sdk_run.exit_code}`,
      `- Duration ms: ${run.sdk_run.duration_ms}`,
      `- Errors: ${run.errors.length}`,
      "",
      "#### SDK Run",
      "",
      "```json",
      JSON.stringify(run.sdk_run, null, 2),
      "```",
      "",
      "#### Transcript",
      "",
      "```json",
      JSON.stringify(run.transcript, null, 2),
      "```",
      "",
      "#### Selections",
      "",
      "```json",
      JSON.stringify(
        {
          tool_calls: run.tool_calls,
          selected_skills: run.selected_skills,
          selected_agents: run.selected_agents,
          handoffs: run.handoffs
        },
        null,
        2
      ),
      "```",
      "",
      "#### Artifacts",
      "",
      "```json",
      JSON.stringify(run.artifacts, null, 2),
      "```",
      ""
    );
  }

  return `${lines.join("\n")}\n`;
}

function scenario(params: Omit<Scenario, "technique_mode">): Scenario {
  return { ...params, technique_mode: "none" };
}

function safeFileName(value: string): string {
  return value.replace(/[^A-Za-z0-9_.-]+/g, "-");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
