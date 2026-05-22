# selection-skill

## Scenario

- Technique family: selection
- Technique surface: skill
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Create narrow TDD plan for adding grounding fixtures without touching unrelated eval suites.",
  "skills": [
    {
      "name": "benchmark",
      "description": "Use repo conventions for AgentV evals, benchmark results, package scripts, and generated data.",
      "body": "Prefer AgentV-native fixtures, strict baseline data shape, root data artifacts, and generated docs committed only after passing validation."
    },
    {
      "name": "detoks",
      "description": "Design token-saving skill split with compact entrypoint and references.",
      "body": "Use only when optimizing skill instruction payloads or measuring token savings."
    }
  ]
}
```

## Captured Runs

### mock

- Exit code: 0
- Duration ms: 1
- Errors: 0

#### SDK Run

```json
{
  "command": [
    "agentv",
    "eval",
    "evals/",
    "--target",
    "mock",
    "--test-id",
    "selection-skill",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"selection-skill\",\"technique_family\":\"selection\",\"technique_surface\":\"skill\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Create narrow TDD plan for adding grounding fixtures without touching unrelated eval suites."
  },
  {
    "role": "assistant",
    "content": "baseline mock selection-skill"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [
    "benchmark"
  ],
  "selected_agents": [],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "selection-skill.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"selection-skill\",\"technique_family\":\"selection\",\"technique_surface\":\"skill\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[\"benchmark\"],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

