import { prisma } from "../src/lib/prisma";
import { MOCK_USER_ID, getOrCreateMockUser } from "../src/lib/mock-user";
import { getAIProvider } from "../src/lib/ai";
import type { FrictionType, SupportStyle, EnergyLevel } from "../src/types";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  PASS: ${message}`);
  }
}

async function smokeTest(): Promise<void> {
  console.log("Pulse Core Loop Smoke Test\n===========================");

  // Step 1: Get or create mock user
  console.log("\n1. Get or create mock user");
  const user = await getOrCreateMockUser();
  assert(!!user, "User exists");
  assert(user.settings !== null, "User has settings");
  console.log(`   User: ${user.name} (${user.id})`);
  console.log(`   Support style: ${user.settings?.supportStyle}`);

  // Step 2: Create a task
  console.log("\n2. Create a task");
  const task = await prisma.task.create({
    data: {
      userId: MOCK_USER_ID,
      title: "Clean the kitchen",
      energyRequired: "low",
      preferredChannel: "in_app",
    },
  });
  assert(!!task.id, "Task has ID");
  assert(task.title === "Clean the kitchen", "Task title correct");
  assert(task.status === "active", "Task status is active");
  assert(task.energyRequired === "low", "Task energy is low");
  console.log(`   Task: "${task.title}" (${task.id})`);

  // Step 3: Start a stuck session
  console.log("\n3. Start a stuck session");
  const ai = getAIProvider();
  const classification = await ai.classifyFriction({
    taskTitle: task.title,
    userState: "Everything is a mess, I don't know where to begin",
  });
  console.log(`   Friction classified: ${classification.frictionType} (${classification.confidence})`);

  const session = await prisma.stuckSession.create({
    data: {
      userId: MOCK_USER_ID,
      taskId: task.id,
      inputChannel: "in_app",
      frictionType: classification.frictionType,
      userState: "Everything is a mess, I don't know where to begin",
    },
  });
  assert(!!session.id, "Stuck session has ID");
  assert(session.frictionType === classification.frictionType, `Friction type matches: ${session.frictionType}`);
  console.log(`   Session: ${session.id} [${session.frictionType}]`);

  // Step 4: Generate a tiny step
  console.log("\n4. Generate a tiny step");
  const supportStyle: SupportStyle =
    (user.settings?.supportStyle as SupportStyle) ?? "gentle";
  const step = await ai.generateTinyStep({
    taskTitle: task.title,
    userState: session.userState ?? undefined,
    frictionType: (session.frictionType as FrictionType) ?? "unclear_first_step",
    energyLevel: (task.energyRequired as EnergyLevel) ?? "medium",
    supportStyle,
    timeAvailableMinutes: 5,
  });

  assert(step.nextStep.length > 0, "Next step is non-empty");
  assert(step.easierVersion.length > 0, "Easier version is non-empty");
  assert(step.estimatedMinutes <= 2, `Estimated minutes <= 2 (got ${step.estimatedMinutes})`);
  console.log(`   Next step: "${step.nextStep}"`);
  console.log(`   Easier version: "${step.easierVersion}"`);
  console.log(`   Estimated minutes: ${step.estimatedMinutes}`);
  console.log(`   Rationale: ${step.rationale}`);

  // Save step to task
  await prisma.task.update({
    where: { id: task.id },
    data: { currentNextStep: step.nextStep },
  });

  await prisma.stuckSession.update({
    where: { id: session.id },
    data: {
      frictionType: step.frictionType,
      generatedFirstStep: step.nextStep,
    },
  });

  const updatedTask = await prisma.task.findUnique({ where: { id: task.id } });
  assert(updatedTask?.currentNextStep === step.nextStep, "Task currentNextStep updated");

  // Step 5: Mark as started (outcome = started)
  console.log("\n5. Mark outcome as started");
  const startedSession = await prisma.stuckSession.update({
    where: { id: session.id },
    data: {
      acceptedFirstStep: true,
      started: true,
      endedAt: new Date(),
    },
  });
  assert(startedSession.started === true, "Session marked as started");
  assert(startedSession.acceptedFirstStep === true, "First step accepted");

  // Create intervention for the started session
  const intervention = await prisma.intervention.create({
    data: {
      userId: MOCK_USER_ID,
      taskId: task.id,
      triggerType: "user_tap_stuck",
      channel: "in_app",
      message: step.nextStep,
      status: "engaged",
      stuckProbability: 0.7,
    },
  });
  assert(!!intervention.id, "Intervention created");
  assert(intervention.status === "engaged", "Intervention status is engaged");
  console.log(`   Intervention: ${intervention.id} [${intervention.status}]`);

  // Link intervention to session
  await prisma.stuckSession.update({
    where: { id: session.id },
    data: { interventionId: intervention.id },
  });

  // Step 6: Verify intervention logged
  console.log("\n6. Verify intervention logged");
  const interventionCount = await prisma.intervention.count({
    where: { userId: MOCK_USER_ID },
  });
  assert(interventionCount >= 1, `At least 1 intervention exists (got ${interventionCount})`);
  console.log(`   Total interventions: ${interventionCount}`);

  // Step 7: Weekly summary
  console.log("\n7. Weekly summary");

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  const weekStart = monday.toISOString().split("T")[0];
  const weekEnd = sunday.toISOString().split("T")[0];

  const weeklyInterventions = await prisma.intervention.count({
    where: {
      userId: MOCK_USER_ID,
      createdAt: { gte: monday, lt: sunday },
    },
  });

  const weeklyTransitions = await prisma.stuckSession.count({
    where: {
      userId: MOCK_USER_ID,
      started: true,
      createdAt: { gte: monday, lt: sunday },
    },
  });

  assert(weeklyInterventions >= 1, `WAI >= 1 (got ${weeklyInterventions})`);
  assert(weeklyTransitions >= 1, `Successful transitions >= 1 (got ${weeklyTransitions})`);
  console.log(`   Week: ${weekStart} → ${weekEnd}`);
  console.log(`   Weekly Active Interventions: ${weeklyInterventions}`);
  console.log(`   Successful transitions: ${weeklyTransitions}`);

  // Create weekly summary record
  const summary = await prisma.weeklySummary.create({
    data: {
      userId: MOCK_USER_ID,
      weekStart,
      weekEnd,
      weeklyActiveInterventions: weeklyInterventions,
      successfulTransitions: weeklyTransitions,
      dismissals: 0,
      falsePositiveReports: 0,
      topFrictionType: classification.frictionType,
      bestChannel: "in_app",
      recommendedAdjustment: "Keep breaking tasks into tiny steps.",
      summaryText: `You started ${weeklyTransitions} time${weeklyTransitions > 1 ? "s" : ""} this week. in_app worked best.`,
    },
  });
  assert(!!summary.id, "Weekly summary created");
  assert(summary.weeklyActiveInterventions >= 1, "Summary WAI is correct");
  console.log(`   Summary: ${summary.summaryText}`);

  // Step 8: Generate a nudge
  console.log("\n8. Generate a nudge");
  const nudge = await ai.generateNudge({
    taskTitle: task.title,
    nextStep: step.nextStep,
    channel: "in_app",
    supportStyle,
    frictionType: classification.frictionType,
  });
  assert(nudge.message.length > 0, "Nudge message is non-empty");
  assert(nudge.message.length <= 60, `Nudge under 60 chars (${nudge.message.length})`);
  console.log(`   Nudge: "${nudge.message}" [${nudge.actionLabel}]`);

  console.log("\n===========================");
  if (process.exitCode) {
    console.log("SOME TESTS FAILED");
  } else {
    console.log("CORE LOOP VERIFIED");
    console.log("\nVertical slice:");
    console.log("  Create task → Stuck Mode → AI step → Start → Intervention → Weekly summary");
    console.log("  ALL STEPS PASSED");
  }
}

smokeTest()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
