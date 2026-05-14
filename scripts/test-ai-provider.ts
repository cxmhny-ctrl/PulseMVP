import {
  MockAIProvider,
  TemplateFallbackProvider,
  OpenAIProviderStub,
  getAIProvider,
  resetAIProvider,
} from "../src/lib/ai";
import type { FrictionType, SupportStyle, EnergyLevel } from "../src/types";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  PASS: ${message}`);
  }
}

async function testMockClassifyFriction(): Promise<void> {
  console.log("\n--- MockAIProvider.classifyFriction ---");

  const provider = new MockAIProvider();
  const cases: { task: string; userState: string; expected: FrictionType }[] = [
    {
      task: "Clean kitchen",
      userState: "Everything is a disaster, I can't handle it",
      expected: "overwhelm",
    },
    {
      task: "Do taxes",
      userState: "I don't know where to start",
      expected: "unclear_first_step",
    },
    {
      task: "Write essay",
      userState: "I'm so tired and drained",
      expected: "energy_mismatch",
    },
    {
      task: "Organize closet",
      userState: "I hate this so much, been avoiding it",
      expected: "emotional_avoidance",
    },
    {
      task: "Fill out forms",
      userState: "This is so boring and tedious",
      expected: "boredom",
    },
  ];

  for (const c of cases) {
    const result = await provider.classifyFriction({
      taskTitle: c.task,
      userState: c.userState,
    });
    console.log(`  Input: "${c.userState}"`);
    console.log(`  Output: ${result.frictionType} (${result.confidence})`);
    assert(
      result.frictionType === c.expected,
      `${c.task}: expected ${c.expected}, got ${result.frictionType}`
    );
  }
}

async function testMockGenerateTinyStep(): Promise<void> {
  console.log("\n--- MockAIProvider.generateTinyStep ---");

  const provider = new MockAIProvider();
  const cases: {
    task: string;
    friction: FrictionType;
    energy: EnergyLevel;
    style: SupportStyle;
  }[] = [
    { task: "Clean kitchen", friction: "overwhelm", energy: "low", style: "gentle" },
    { task: "Write essay", friction: "unclear_first_step", energy: "medium", style: "direct" },
    { task: "Do taxes", friction: "emotional_avoidance", energy: "low", style: "ultra_minimal" },
    { task: "Fold laundry", friction: "boredom", energy: "medium", style: "funny" },
    { task: "Send email", friction: "perfectionism", energy: "high", style: "direct" },
  ];

  for (const c of cases) {
    const result = await provider.generateTinyStep({
      taskTitle: c.task,
      frictionType: c.friction,
      energyLevel: c.energy,
      supportStyle: c.style,
      timeAvailableMinutes: 5,
    });
    console.log(`  Task: "${c.task}" [${c.friction}]`);
    console.log(`  Step: "${result.nextStep}"`);
    console.log(`  Easier: "${result.easierVersion}"`);
    console.log(`  Minutes: ${result.estimatedMinutes}`);
    assert(result.nextStep.length > 0, "nextStep is non-empty");
    assert(result.easierVersion.length > 0, "easierVersion is non-empty");
    assert(result.nextStep !== result.easierVersion, "nextStep differs from easierVersion");
    assert(result.estimatedMinutes <= 2, `estimatedMinutes <= 2 (got ${result.estimatedMinutes})`);
    assert(result.nextStep.length < 100, "nextStep is under 100 chars");
  }
}

async function testMockGenerateNudge(): Promise<void> {
  console.log("\n--- MockAIProvider.generateNudge ---");

  const provider = new MockAIProvider();
  const cases: { task: string; nextStep: string; channel: string; style: SupportStyle; friction: FrictionType }[] = [
    { task: "Clean kitchen", nextStep: "Pick one item", channel: "in_app", style: "gentle", friction: "overwhelm" },
    { task: "Write essay", nextStep: "Open the doc", channel: "notification", style: "direct", friction: "unclear_first_step" },
    { task: "Do taxes", nextStep: "Gather papers", channel: "sms", style: "ultra_minimal", friction: "emotional_avoidance" },
    { task: "Fold laundry", nextStep: "Take one shirt", channel: "in_app", style: "funny", friction: "boredom" },
    { task: "Send email", nextStep: "Draft subject", channel: "notification", style: "direct", friction: "perfectionism" },
  ];

  for (const c of cases) {
    const result = await provider.generateNudge({
      taskTitle: c.task,
      nextStep: c.nextStep,
      channel: c.channel,
      supportStyle: c.style,
      frictionType: c.friction,
    });
    console.log(`  Task: "${c.task}" → "${result.message}" [${result.actionLabel}]`);
    assert(result.message.length > 0, "message is non-empty");
    assert(result.actionLabel.length > 0, "actionLabel is non-empty");
    assert(result.message.length <= 60, `message under 60 chars (got ${result.message.length})`);
  }
}

async function testTemplateFallback(): Promise<void> {
  console.log("\n--- TemplateFallbackProvider ---");

  const provider = new TemplateFallbackProvider();

  const step = await provider.generateTinyStep({
    taskTitle: "Clean kitchen",
    frictionType: "overwhelm",
    energyLevel: "low",
    supportStyle: "gentle",
  });
  console.log(`  Step: "${step.nextStep}"`);
  console.log(`  Easier: "${step.easierVersion}"`);
  assert(step.nextStep.length > 0, "fallback step is non-empty");
  assert(step.easierVersion.length > 0, "fallback easierVersion is non-empty");

  const friction = await provider.classifyFriction({
    taskTitle: "Test",
    userState: "anything",
  });
  assert(
    friction.frictionType === "unclear_first_step",
    "fallback classify returns unclear_first_step"
  );
  assert(friction.confidence === 0.4, "fallback classify has low confidence");

  const nudge = await provider.generateNudge({
    taskTitle: "Clean kitchen",
    nextStep: "test",
    channel: "in_app",
    supportStyle: "gentle",
  });
  assert(nudge.message.length > 0, "fallback nudge is non-empty");
  console.log(`  Nudge: "${nudge.message}"`);
}

async function testOpenAIStub(): Promise<void> {
  console.log("\n--- OpenAIProviderStub ---");

  const provider = new OpenAIProviderStub();
  let threwClassify = false;
  let threwStep = false;
  let threwNudge = false;

  try {
    await provider.classifyFriction({ taskTitle: "Test", userState: "test" });
  } catch {
    threwClassify = true;
  }
  try {
    await provider.generateTinyStep({
      taskTitle: "Test",
      frictionType: "overwhelm",
      energyLevel: "low",
      supportStyle: "gentle",
    });
  } catch {
    threwStep = true;
  }
  try {
    await provider.generateNudge({
      taskTitle: "Test",
      nextStep: "test",
      channel: "in_app",
      supportStyle: "gentle",
    });
  } catch {
    threwNudge = true;
  }

  assert(threwClassify, "classifyFriction throws");
  assert(threwStep, "generateTinyStep throws");
  assert(threwNudge, "generateNudge throws");
}

async function testFactory(): Promise<void> {
  console.log("\n--- AI Provider Factory ---");

  resetAIProvider();
  const defaultProvider = getAIProvider();
  assert(
    defaultProvider instanceof MockAIProvider,
    "default provider is MockAIProvider"
  );

  const step = await defaultProvider.generateTinyStep({
    taskTitle: "Test task",
    frictionType: "too_large",
    energyLevel: "medium",
    supportStyle: "gentle",
  });
  assert(step.nextStep.length > 0, "factory default provider works");
  console.log(`  Default provider step: "${step.nextStep}"`);
}

async function main(): Promise<void> {
  console.log("Pulse AI Provider Verification\n==============================");

  await testMockClassifyFriction();
  await testMockGenerateTinyStep();
  await testMockGenerateNudge();
  await testTemplateFallback();
  await testOpenAIStub();
  await testFactory();

  console.log("\n==============================");
  if (process.exitCode) {
    console.log("SOME TESTS FAILED");
  } else {
    console.log("ALL TESTS PASSED");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
