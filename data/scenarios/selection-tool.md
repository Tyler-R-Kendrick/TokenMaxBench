# selection-tool

## Scenario

- Technique family: selection
- Technique surface: tool
- Technique mode: none
- Targets: mock

## Input

```json
{
  "prompt": "Inspect README.md and package.json, then report package name and available benchmark scripts.",
  "tool_definitions": [
    {
      "name": "read_file",
      "description": "Read UTF-8 file contents from workspace.",
      "input_schema": {
        "type": "object",
        "required": [
          "path"
        ],
        "properties": {
          "path": {
            "type": "string"
          }
        }
      }
    },
    {
      "name": "run_tests",
      "description": "Run package test command and return exit code plus output.",
      "input_schema": {
        "type": "object",
        "required": [
          "command"
        ],
        "properties": {
          "command": {
            "type": "string"
          }
        }
      }
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
    "selection-tool",
    "--json"
  ],
  "exit_code": 0,
  "stdout": "{\"ok\":true,\"target\":\"mock\",\"scenario\":\"selection-tool\",\"technique_family\":\"selection\",\"technique_surface\":\"tool\",\"technique_mode\":\"none\"}",
  "stderr": "",
  "duration_ms": 1
}
```

#### Transcript

```json
[
  {
    "role": "user",
    "content": "Inspect README.md and package.json, then report package name and available benchmark scripts."
  },
  {
    "role": "assistant",
    "content": "baseline mock selection-tool"
  }
]
```

#### Selections

```json
{
  "tool_calls": [
    {
      "name": "read_file",
      "args": {
        "path": "README.md"
      }
    },
    {
      "name": "read_file",
      "args": {
        "path": "package.json"
      }
    }
  ],
  "selected_skills": [],
  "selected_agents": [],
  "handoffs": []
}
```

#### Artifacts

```json
[
  {
    "name": "selection-tool.mock.json",
    "content": "{\"target\":\"mock\",\"scenario_id\":\"selection-tool\",\"technique_family\":\"selection\",\"technique_surface\":\"tool\",\"technique_mode\":\"none\",\"tool_calls\":[{\"name\":\"read_file\",\"args\":{\"path\":\"README.md\"}},{\"name\":\"read_file\",\"args\":{\"path\":\"package.json\"}}],\"selected_skills\":[],\"selected_agents\":[],\"handoffs\":[]}"
  }
]
```

