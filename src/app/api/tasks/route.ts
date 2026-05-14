import { getOrCreateMockUser, MOCK_USER_ID } from "@/lib/mock-user";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError } from "@/lib/api-response";
import type { EnergyLevel } from "@/types";

const VALID_ENERGY: EnergyLevel[] = ["low", "medium", "high"];
const VALID_CHANNELS = ["widget", "notification", "sms", "voice", "in_app"];

export async function GET() {
  try {
    await getOrCreateMockUser();
    const tasks = await prisma.task.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
    });
    return ok(tasks);
  } catch (err) {
    return serverError("Failed to list tasks.");
  }
}

export async function POST(request: Request) {
  try {
    await getOrCreateMockUser();
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Request body must be a JSON object.");
    }

    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return badRequest("title is required and must be a non-empty string.");
    }

    const data: Record<string, unknown> = {
      userId: MOCK_USER_ID,
      title: body.title.trim(),
      source: "text",
    };

    if (body.energyLevel !== undefined) {
      if (!VALID_ENERGY.includes(body.energyLevel)) {
        return badRequest(
          `Invalid energyLevel. Must be one of: ${VALID_ENERGY.join(", ")}.`
        );
      }
      data.energyRequired = body.energyLevel;
    }

    if (body.preferredChannel !== undefined) {
      if (!VALID_CHANNELS.includes(body.preferredChannel)) {
        return badRequest(
          `Invalid preferredChannel. Must be one of: ${VALID_CHANNELS.join(", ")}.`
        );
      }
      data.preferredChannel = body.preferredChannel;
    }

    if (body.scheduledStart !== undefined) {
      const d = new Date(body.scheduledStart);
      if (isNaN(d.getTime())) {
        return badRequest("scheduledStart must be a valid ISO date string.");
      }
      data.windowStart = d;
    }

    if (body.scheduledEnd !== undefined) {
      const d = new Date(body.scheduledEnd);
      if (isNaN(d.getTime())) {
        return badRequest("scheduledEnd must be a valid ISO date string.");
      }
      data.windowEnd = d;
    }

    const task = await prisma.task.create({ data: data as never });
    return created(task);
  } catch (err) {
    return serverError("Failed to create task.");
  }
}
