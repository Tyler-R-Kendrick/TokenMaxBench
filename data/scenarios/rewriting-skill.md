# rewriting-skill

## Scenario

- Technique family: rewriting
- Technique surface: skill
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Rewrite verbose skill instructions into a concise skill while preserving triggers, workflow, and constraints.",
  "skills": [
    {
      "name": "fixture-author",
      "description": "Verbose skill source for baseline rewrite capture.",
      "body": "When asked to author grounding data, first identify the technique family and surface. Then create one fixture that exercises target behavior without applying optimization techniques. Keep scenario input explicit enough that future AgentV graders can compare tool calls, skill selection, agent routing, handoffs, and prompt rewrites."
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
    "rewriting-skill",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"rewriting-skill\",\"technique_family\":\"rewriting\",\"technique_surface\":\"skill\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Rewrite verbose skill instructions into a concise skill while preserving triggers, workflow, and constraints."
  },
  {
    "role": "assistant",
    "content": "baseline mock rewriting-skill"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [
    "fixture-author"
  ],
  "selected_agents": [],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "rewriting-skill.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"rewriting-skill\",\"technique_family\":\"rewriting\",\"technique_surface\":\"skill\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[\"fixture-author\"],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

