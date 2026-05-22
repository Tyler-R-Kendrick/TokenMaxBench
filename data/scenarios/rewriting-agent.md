# rewriting-agent

## Scenario

- Technique family: rewriting
- Technique surface: agent
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Rewrite agent instructions for a baseline-capture worker. Preserve scope and fail-fast behavior.",
  "agents": [
    {
      "name": "baseline-capture-worker",
      "description": "Runs first-party grounding scenarios.",
      "instructions": "Execute each scenario through configured SDK target. Capture transcript, selected tools, selected skills, selected agents, handoffs, artifacts, and errors. Do not score accuracy or compare compaction techniques. Fail run if target cannot execute."
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
    "rewriting-agent",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"rewriting-agent\",\"technique_family\":\"rewriting\",\"technique_surface\":\"agent\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Rewrite agent instructions for a baseline-capture worker. Preserve scope and fail-fast behavior."
  },
  {
    "role": "assistant",
    "content": "baseline mock rewriting-agent"
  }
]
```

#### Selections

```json
{
  "tool_calls": [],
  "selected_skills": [],
  "selected_agents": [
    "baseline-capture-worker"
  ],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "rewriting-agent.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"rewriting-agent\",\"technique_family\":\"rewriting\",\"technique_surface\":\"agent\",\"technique_mode\":\"none\",\"tool_calls\":[],\"selected_skills\":[],\"selected_agents\":[\"baseline-capture-worker\"],\"handoffs\":[]}"
  }
]
```

