import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";
import type { EnergyLevel, TaskStatus } from "@/types";

const VALID_STATUSES: TaskStatus[] = ["active", "completed", "dismissed"];
const VALID_ENERGY: EnergyLevel[] = ["low", "medium", "high"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Request body must be a JSON object.");
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId: MOCK_USER_ID },
    });
    if (!existing) return notFound("Task");

    const data: Record<string, unknown> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return badRequest("title must be a non-empty string.");
      }
      data.title = body.title.trim();
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return badRequest(
          `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`
        );
      }
      data.status = body.status;
    }

    if (body.energyLevel !== undefined) {
      if (!VALID_ENERGY.includes(body.energyLevel)) {
        return badRequest(
          `Invalid energyLevel. Must be one of: ${VALID_ENERGY.join(", ")}.`
        );
      }
      data.energyRequired = body.energyLevel;
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

    if (body.currentNextStep !== undefined) {
      if (typeof body.currentNextStep !== "string") {
        return badRequest("currentNextStep must be a string.");
      }
      data.currentNextStep = body.currentNextStep;
    }

    const task = await prisma.task.update({
      where: { id },
      data: data as never,
    });

    return ok(task);
  } catch (err) {
    return serverError("Failed to update task.");
  }
}
