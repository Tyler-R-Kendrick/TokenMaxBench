const requiredEnv = ["OPENAI_API_KEY"];

const missing = requiredEnv.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(
    `Missing required benchmark environment variable(s): ${missing.join(", ")}`
  );
  console.error("Real AgentV benchmark runs need a live grader target.");
  process.exit(1);
}
