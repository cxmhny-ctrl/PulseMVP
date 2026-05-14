import { prisma } from "../src/lib/prisma";
import { MOCK_USER_ID } from "../src/lib/mock-user";

async function reset() {
  console.log("Resetting demo data…\n");

  // Clear existing data for mock user
  await prisma.weeklySummary.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.stuckSession.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.intervention.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.task.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.userSettings.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.user.deleteMany({ where: { id: MOCK_USER_ID } });
  console.log("  Deleted all existing data for mock user.");

  // Recreate mock user with default settings
  const user = await prisma.user.create({
    data: {
      id: MOCK_USER_ID,
      email: "demo@pulse.local",
      name: "Demo User",
      settings: {
        create: {
          supportStyle: "gentle",
          stuckSensitivity: "medium",
          quietHoursEnabled: true,
          quietHoursStart: "22:00",
          quietHoursEnd: "08:00",
        },
      },
    },
    include: { settings: true },
  });
  console.log(`  Created user: ${user.name} (${user.id})`);
  console.log(`  Support style: ${user.settings?.supportStyle}`);
  console.log(`  Sensitivity: ${user.settings?.stuckSensitivity}`);
  console.log(`  Quiet hours: ${user.settings?.quietHoursStart} – ${user.settings?.quietHoursEnd}`);

  // Create sample tasks
  const tasks = [
    { title: "Clean the kitchen", energyRequired: "low" },
    { title: "Send important email", energyRequired: "medium" },
  ];
  for (const t of tasks) {
    const task = await prisma.task.create({
      data: { userId: MOCK_USER_ID, ...t },
    });
    console.log(`  Created task: "${task.title}" (${task.energyRequired} energy)`);
  }

  console.log("\nDemo data reset complete.");
  console.log("Run `npm run dev` and open http://localhost:3000");
}

reset()
  .catch((err) => {
    console.error("Reset failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
