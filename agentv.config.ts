import { defineConfig } from '@agentv/core';

export default defineConfig({
  execution: {
    workers: 1,
    maxRetries: 0,
    verbose: false,
    otelFile: '.agentv/results/otel-{timestamp}.json'
  },
  output: {
    format: 'jsonl',
    dir: './results'
  },
  limits: {
    maxCostUsd: 10
  }
});
