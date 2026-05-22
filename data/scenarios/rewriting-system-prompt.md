# rewriting-system-prompt

## Scenario

- Technique family: rewriting
- Technique surface: system-prompt
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Rewrite system prompt for lower ambiguity while preserving all behavioral constraints.",
  "system_prompt": "You are baseline runner.\nUse technique_mode none only.\nCapture SDK behavior for compaction, selection, and rewriting surfaces.\nDo not grade, optimize, compact, or compare external tools.\nReturn structured baseline data suitable for future AgentV evaluators."
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
    "rewriting-system-prompt",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"rewriting-system-prompt\",\"technique_family\":\"rewriting\",\"technique_surface\":\"system-prompt\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Rewrite system prompt for lower ambiguity while preserving all behavioral constraints."
  },
  {
    "role": "assistant",
    "content": "baseline mock rewriting-system-prompt"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [],
  "selected_agents": [],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "rewriting-system-prompt.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"rewriting-system-prompt\",\"technique_family\":\"rewriting\",\"technique_surface\":\"system-prompt\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

