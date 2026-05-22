# compaction-input

## Scenario

- Technique family: compaction
- Technique surface: input
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Read long project instructions, package constraints, and benchmark notes.\nSummarize implementation constraints for future input compaction.\nPreserve exact file paths, exported symbol names, token budget numbers, and unresolved questions.\nDo not apply compaction. Capture full clean-run behavior for baseline grounding."
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
    "compaction-input",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"compaction-input\",\"technique_family\":\"compaction\",\"technique_surface\":\"input\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Read long project instructions, package constraints, and benchmark notes.\nSummarize implementation constraints for future input compaction.\nPreserve exact file paths, exported symbol names, token budget numbers, and unresolved questions.\nDo not apply compaction. Capture full clean-run behavior for baseline grounding."
  },
  {
    "role": "assistant",
    "content": "baseline mock compaction-input"
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
    "name": "compaction-input.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"compaction-input\",\"technique_family\":\"compaction\",\"technique_surface\":\"input\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

