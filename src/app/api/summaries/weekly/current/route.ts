import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";
import { ok, serverError } from "@/lib/api-response";

function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
    monday,
    sunday,
  };
}

export async function GET() {
  try {
    const { weekStart, weekEnd, monday, sunday } = getCurrentWeekRange();

    const interventions = await prisma.intervention.findMany({
      where: {
        userId: MOCK_USER_ID,
        createdAt: { gte: monday, lt: sunday },
      },
    });

    const stuckSessions = await prisma.stuckSession.findMany({
      where: {
        userId: MOCK_USER_ID,
        createdAt: { gte: monday, lt: sunday },
      },
    });

    const weeklyActiveInterventions = interventions.length;
    const successfulTransitions = stuckSessions.filter((s) => s.started).length;
    const dismissals = interventions.filter((i) => i.status === "dismissed").length;

    const frictionCounts: Record<string, number> = {};
    for (const s of stuckSessions) {
      if (s.frictionType) {
        frictionCounts[s.frictionType] = (frictionCounts[s.frictionType] || 0) + 1;
      }
    }
    let topFrictionType: string | null = null;
    let topFrictionCount = 0;
    for (const [ft, count] of Object.entries(frictionCounts)) {
      if (count > topFrictionCount) {
        topFrictionCount = count;
        topFrictionType = ft;
      }
    }

    const channelCounts: Record<string, number> = {};
    for (const i of interventions) {
      if (i.status === "engaged") {
        channelCounts[i.channel] = (channelCounts[i.channel] || 0) + 1;
      }
    }
    let bestChannel: string | null = null;
    let bestChannelCount = 0;
    for (const [ch, count] of Object.entries(channelCounts)) {
      if (count > bestChannelCount) {
        bestChannelCount = count;
        bestChannel = ch;
      }
    }

    let suggestedAdjustment: string | null = null;
    if (topFrictionType === "overwhelm") {
      suggestedAdjustment = "Try breaking tasks into smaller pieces before you start.";
    } else if (topFrictionType === "perfectionism") {
      suggestedAdjustment = "Remind yourself that done beats perfect.";
    } else if (topFrictionType === "emotional_avoidance") {
      suggestedAdjustment = "Start with neutral setup actions before the task.";
    } else if (topFrictionType === "energy_mismatch") {
      suggestedAdjustment = "Try scheduling tasks earlier in the day.";
    } else if (successfulTransitions > 0) {
      suggestedAdjustment = "Keep doing what works.";
    }

    const headline =
      successfulTransitions > 0
        ? `You started ${successfulTransitions} time${successfulTransitions > 1 ? "s" : ""} this week.`
        : "No starts recorded yet this week.";

    const summaryText = [
      headline,
      bestChannel ? `"${bestChannel}" worked best.` : "",
      topFrictionType ? `"${topFrictionType}" was the top friction.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const existing = await prisma.weeklySummary.findFirst({
      where: { userId: MOCK_USER_ID, weekStart },
    });

    const summaryData = {
      weeklyActiveInterventions,
      successfulTransitions,
      dismissals,
      falsePositiveReports: 0,
      topFrictionType,
      bestChannel,
      recommendedAdjustment: suggestedAdjustment,
      summaryText,
    };

    let summary;
    if (existing) {
      summary = await prisma.weeklySummary.update({
        where: { id: existing.id },
        data: summaryData,
      });
    } else {
      summary = await prisma.weeklySummary.create({
        data: {
          userId: MOCK_USER_ID,
          weekStart,
          weekEnd,
          ...summaryData,
        },
      });
    }

    return ok(summary);
  } catch (err) {
    return serverError("Failed to generate weekly summary.");
  }
}
