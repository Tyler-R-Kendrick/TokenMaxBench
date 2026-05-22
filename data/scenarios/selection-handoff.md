# selection-handoff

## Scenario

- Technique family: selection
- Technique surface: handoff
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Plan fixture rewrite, hand off implementation, then hand off review when code and generated artifacts exist.",
  "agents": [
    {
      "name": "planner",
      "description": "Breaks benchmark work into ordered implementation steps.",
      "instructions": "Stop after acceptance criteria and file list are clear."
    },
    {
      "name": "implementer",
      "description": "Edits AgentV fixtures, scripts, and generated artifacts.",
      "instructions": "Run focused validation after edits."
    },
    {
      "name": "reviewer",
      "description": "Checks diff for external suite references, target drift, and missing artifact regeneration.",
      "instructions": "Return only blocking findings."
    }
  ],
  "handoffs": [
    {
      "from": "planner",
      "to": "implementer",
      "condition": "Implementation file list is known."
    },
    {
      "from": "implementer",
      "to": "reviewer",
      "condition": "Validation and data generation complete."
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
    "selection-handoff",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"selection-handoff\",\"technique_family\":\"selection\",\"technique_surface\":\"handoff\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Plan fixture rewrite, hand off implementation, then hand off review when code and generated artifacts exist."
  },
  {
    "role": "assistant",
    "content": "baseline mock selection-handoff"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [],
  "selected_agents": [
    "planner",
    "implementer",
    "reviewer"
  ],
  "handoffs": [
    {
      "from": "planner",
      "to": "implementer",
      "reason": "Implementation file list is known."
    },
    {
      "from": "implementer",
      "to": "reviewer",
      "reason": "Validation and data generation complete."
    }
  ]
}
```

#### Artifacts

```json
[
  {
    "name": "selection-handoff.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"selection-handoff\",\"technique_family\":\"selection\",\"technique_surface\":\"handoff\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[\"planner\",\"implementer\",\"reviewer\"],\"handoffs\":[{\"from\":\"planner\",\"to\":\"implementer\",\"reason\":\"Implementation file list is known.\"},{\"from\":\"implementer\",\"to\":\"reviewer\",\"reason\":\"Validation and data generation complete.\"}]}"
  }
]
```

