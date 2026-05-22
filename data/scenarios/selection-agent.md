# selection-agent

## Scenario

- Technique family: selection
- Technique surface: agent
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Choose best specialist agent to update eval fixtures and explain why, then provide next implementation step.",
  "agents": [
    {
      "name": "benchmark-maintainer",
      "description": "Maintains AgentV benchmark suites and persisted baseline data.",
      "instructions": "Inspect evals, target config, generated data, and result conventions before editing."
    },
    {
      "name": "docs-maintainer",
      "description": "Maintains README and explanatory benchmark docs.",
      "instructions": "Prefer docs-only changes unless benchmark data contract already exists."
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
    "selection-agent",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"selection-agent\",\"technique_family\":\"selection\",\"technique_surface\":\"agent\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Choose best specialist agent to update eval fixtures and explain why, then provide next implementation step."
  },
  {
    "role": "assistant",
    "content": "baseline mock selection-agent"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [],
  "selected_agents": [
    "benchmark-maintainer"
  ],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "selection-agent.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"selection-agent\",\"technique_family\":\"selection\",\"technique_surface\":\"agent\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[\"benchmark-maintainer\"],\"handoffs\":[]}"
  }
]
```

