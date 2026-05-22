# compaction-output

## Scenario

- Technique family: compaction
- Technique surface: output
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Given verbose tool output below, produce maintainer-facing summary with exact failing command, failing package, and next fix.\nDo not compress output through any benchmark technique. Capture normal SDK response shape.",
  "tool_output": "> npm run validate\nFAIL evals/grounding.EVAL.yaml\nExpected first-party grounding fixtures, found legacy comparison import.\nExpected targets [mock], found legacy SDK targets."
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
    "compaction-output",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"compaction-output\",\"technique_family\":\"compaction\",\"technique_surface\":\"output\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Given verbose tool output below, produce maintainer-facing summary with exact failing command, failing package, and next fix.\nDo not compress output through any benchmark technique. Capture normal SDK response shape."
  },
  {
    "role": "assistant",
    "content": "baseline mock compaction-output"
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
    "name": "compaction-output.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"compaction-output\",\"technique_family\":\"compaction\",\"technique_surface\":\"output\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

