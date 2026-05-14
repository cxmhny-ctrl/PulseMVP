import { prisma } from "../src/lib/prisma";
import { MOCK_USER_ID, getOrCreateMockUser } from "../src/lib/mock-user";

let passed = 0;
let failed = 0;

function pass(label: string) {
  console.log(`  PASS: ${label}`);
  passed++;
}

function fail(label: string, detail?: unknown) {
  console.log(`  FAIL: ${label}`);
  if (detail !== undefined) console.log(`         ${detail}`);
  process.exitCode = 1;
  failed++;
}

async function testCase(
  label: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const task = await prisma.task.create({ data: data as never });
    if (!task.id) throw new Error("No id returned");
    pass(`${label} — created task "${task.title}"`);

    // Verify the fields we set
    if (task.title !== data.title) fail(`${label}: title mismatch`);
    if (data.energyRequired && task.energyRequired !== data.energyRequired)
      fail(`${label}: energyRequired mismatch`);
    if (data.preferredChannel !== undefined && task.preferredChannel !== data.preferredChannel)
      fail(`${label}: preferredChannel mismatch`);

    // Clean up
    await prisma.task.delete({ where: { id: task.id } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`${label}`, message);
  }
}

async function main() {
  console.log("Pulse Task Creation Test\n========================");

  try {
    await getOrCreateMockUser();
    console.log("\nMock user ready.");
  } catch {
    console.log("No database (requires local Postgres). Tests cannot run.");
    console.log(
      "Start a local Postgres or temporarily switch prisma/schema.prisma to 'sqlite' provider."
    );
    return;
  }

  // Case 1: title only (bare minimum)
  console.log("\n1. Title only");
  await testCase("title only", {
    userId: MOCK_USER_ID,
    title: "Clean the kitchen",
    source: "text",
  });

  // Case 2: title + energy
  console.log("\n2. Title + energy");
  await testCase("title + energy", {
    userId: MOCK_USER_ID,
    title: "Pay bills",
    source: "text",
    energyRequired: "low",
  });

  // Case 3: title + empty date fields (simulate the "auto-filled" bug)
  console.log("\n3. Title + empty date strings (should omit or fail cleanly)");
  {
    const data: Record<string, unknown> = {
      userId: MOCK_USER_ID,
      title: "Sort mail",
      source: "text",
    };
    // Simulate: empty string for date — should be omitted, not stored as ""
    // If the API puts empty string in windowStart, Prisma DateTime? rejects it
    // This test case intentionally DOES NOT set windowStart/windowEnd with ""
    // to confirm the default path works.
    await testCase("title only (no date)", data);
  }

  // Case 4: title + valid scheduledStart ISO string
  console.log("\n4. Title + valid windowStart");
  await testCase("title + windowStart", {
    userId: MOCK_USER_ID,
    title: "Fold laundry",
    source: "text",
    windowStart: new Date(Date.now() + 3600000).toISOString(),
  });

  // Case 5: title + scheduledStart + scheduledEnd
  console.log("\n5. Title + windowStart + windowEnd");
  const start = new Date(Date.now() + 7200000).toISOString();
  const end = new Date(Date.now() + 10800000).toISOString();
  await testCase("title + both windows", {
    userId: MOCK_USER_ID,
    title: "Write report",
    source: "text",
    energyRequired: "high",
    preferredChannel: "in_app",
    windowStart: start,
    windowEnd: end,
  });

  // Case 6: Verify Prisma rejects empty strings for DateTime fields
  console.log("\n6. Empty string in DateTime field (should fail)");
  try {
    await prisma.task.create({
      data: {
        userId: MOCK_USER_ID,
        title: "Should fail",
        windowStart: "" as never,
      } as never,
    });
    fail("empty string windowStart — should have thrown but did not");
  } catch {
    pass("empty string windowStart — correctly rejected by Prisma/Postgres");
  }

  // Summary
  console.log(`\n========================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log("SOME TESTS FAILED");
  } else {
    console.log("ALL TASK CREATION TESTS PASSED");
  }
}

main()
  .catch((err) => {
    console.error("Fatal:", err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
