import { prisma } from "./prisma";

export const MOCK_USER_ID = "mock-user-001";

export async function getOrCreateMockUser() {
  let user = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID },
    include: { settings: true },
  });

  if (!user) {
    try {
      user = await prisma.user.create({
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
    } catch (err) {
      console.error("Failed to create mock user:", err);
      throw err;
    }
  }

  return user;
}
