/**
 * DeepSeek Reasoner smoke test.
 *
 * Usage:
 *   DEEPSEEK_API_KEY=sk-... npx tsx scripts/test-deepseek-provider.ts
 *
 * If DEEPSEEK_API_KEY is not set, only the broad-word detection and
 * safe-step unit tests run (no API calls).
 */

import { DeepSeekProvider, isStepTooBroad, getSafeStep } from "../src/lib/ai/deepseek-provider";
import type { FrictionType, EnergyLevel, SupportStyle } from "../src/types";

// ── Unit tests (always run, no API key needed) ──

function testBroadDetection() {
  console.log("--- broad-word detection (unit) ---");
  const broad = [
    "Pick up all trash from counters",
    "Clean up the entire kitchen",
    "Organize the whole desk",
    "Tidy everything on the floor",
    "Finish cleaning the counters",
    "Clear out every drawer",
  ];
  const narrow = [
    "Pick up one dirty plate and put it in the sink",
    "Put one piece of clothing into the hamper",
    "Open the email and read the first sentence",
    "Pick one visible item related to this task and touch it",
    "Wipe one section of the counter with a cloth",
  ];
  let pass = 0;
  let fail = 0;
  for (const s of broad) {
    if (isStepTooBroad(s)) { pass++; } else { console.error(`  FAIL: should detect as broad: "${s}"`); fail++; }
  }
  for (const s of narrow) {
    if (!isStepTooBroad(s)) { pass++; } else { console.error(`  FAIL: should NOT detect as broad: "${s}"`); fail++; }
  }
  const total = broad.length + narrow.length;
  if (fail === 0) console.log(`  PASS (${total}/${total})`); else console.log(`  ${pass}/${total} passed, ${fail} failed`);
  console.log("");
}

function testSafeSteps() {
  console.log("--- safe-step replacements (unit) ---");
  const cases: { title: string; expectContains: string }[] = [
    { title: "Clean kitchen", expectContains: "counter" },
    { title: "Do dishes", expectContains: "counter" },
    { title: "Fold laundry", expectContains: "hamper" },
    { title: "Sort clothes", expectContains: "hamper" },
    { title: "Send email to boss", expectContains: "email" },
    { title: "Reply to inbox", expectContains: "email" },
    { title: "Sweep floor", expectContains: "floor" },
    { title: "Clean desk", expectContains: "desk" },
    { title: "Clean bathroom", expectContains: "bathroom" },
    { title: "Read book", expectContains: "this task" }, // default case
  ];
  let pass = 0;
  let fail = 0;
  for (const c of cases) {
    const s = getSafeStep(c.title);
    if (!s.nextStep || !s.easierVersion) { console.error(`  FAIL: empty fields for "${c.title}"`); fail++; continue; }
    if (!s.nextStep.toLowerCase().includes(c.expectContains)) {
      console.error(`  FAIL: "${c.title}" → "${s.nextStep}" does not contain "${c.expectContains}"`);
      fail++;
      continue;
    }
    if (isStepTooBroad(s.nextStep)) {
      console.error(`  FAIL: safe step for "${c.title}" is itself too broad: "${s.nextStep}"`);
      fail++;
      continue;
    }
    pass++;
  }
  if (fail === 0) console.log(`  PASS (${cases.length}/${cases.length})`); else console.log(`  ${pass}/${cases.length} passed, ${fail} failed`);
  console.log("");
}

function testNoBroadInSafeSteps() {
  console.log("--- safe steps never contain banned words (unit) ---");
  const titles = ["Clean kitchen", "Do laundry", "Send email", "Unknown task", "Organize desk", "Clean bathroom", "Vacuum floor"];
  let pass = 0;
  for (const t of titles) {
    const s = getSafeStep(t);
    if (isStepTooBroad(s.nextStep) || isStepTooBroad(s.easierVersion)) {
      console.error(`  FAIL: safe step for "${t}" contains banned word: "${s.nextStep}" / "${s.easierVersion}"`);
    } else {
      pass++;
    }
  }
  if (pass === titles.length) console.log(`  PASS (${titles.length}/${titles.length})`); 
  console.log("");
}

// ── Main ──

async function main() {
  console.log("DeepSeek Provider — smoke test\n");

  // Unit tests always run
  testBroadDetection();
  testSafeSteps();
  testNoBroadInSafeSteps();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.log("DEEPSEEK_API_KEY not set — skipping live API tests.");
    console.log("Unit tests complete.\n");
    return;
  }

  console.log(`Model: ${process.env.DEEPSEEK_MODEL || "deepseek-reasoner"}`);
  console.log(`Base URL: ${process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"}\n`);

  const provider = new DeepSeekProvider();

  // 1. classifyFriction
  console.log("--- classifyFriction ---");
  try {
    const friction = await provider.classifyFriction({
      taskTitle: "Clean kitchen",
      userState: "I have no idea where to start, it's a disaster",
    });
    console.log(JSON.stringify(friction, null, 2));
    validate(friction.frictionType, "frictionType", "string");
    validate(friction.confidence, "confidence", "number");
    validate(friction.reason, "reason", "string");
    console.log("  PASS\n");
  } catch (err) {
    console.error("  FAIL:", (err as Error).message, "\n");
  }

  // 2. generateTinyStep
  console.log("--- generateTinyStep ---");
  try {
    const step = await provider.generateTinyStep({
      taskTitle: "Clean kitchen",
      frictionType: "overwhelm" as FrictionType,
      energyLevel: "low" as EnergyLevel,
      supportStyle: "gentle" as SupportStyle,
      timeAvailableMinutes: 5,
    });
    console.log(JSON.stringify(step, null, 2));
    validate(step.nextStep, "nextStep", "string");
    validate(step.easierVersion, "easierVersion", "string");
    validate(step.estimatedMinutes, "estimatedMinutes", "number");
    validate(step.rationale, "rationale", "string");
    validate(step.frictionType, "frictionType", "string");
    if (isStepTooBroad(step.nextStep)) {
      console.error(`  FAIL: generated step is too broad: "${step.nextStep}"`);
    } else {
      console.log("  PASS\n");
    }
  } catch (err) {
    console.error("  FAIL:", (err as Error).message, "\n");
  }

  // 3. generateNudge
  console.log("--- generateNudge ---");
  try {
    const nudge = await provider.generateNudge({
      taskTitle: "Clean kitchen",
      nextStep: "Pick up one dirty plate and put it in the sink",
      channel: "in_app",
      supportStyle: "gentle" as SupportStyle,
    });
    console.log(JSON.stringify(nudge, null, 2));
    validate(nudge.message, "message", "string");
    validate(nudge.actionLabel, "actionLabel", "string");
    console.log("  PASS\n");
  } catch (err) {
    console.error("  FAIL:", (err as Error).message, "\n");
  }

  console.log("Done.");
}

function validate(value: unknown, name: string, type: string) {
  if (value === undefined || value === null) throw new Error(`Missing required field: ${name}`);
  if (type === "string" && typeof value !== "string") throw new Error(`${name} should be string, got ${typeof value}`);
  if (type === "number" && typeof value !== "number") throw new Error(`${name} should be number, got ${typeof value}`);
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
