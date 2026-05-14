import { getOrCreateMockUser, MOCK_USER_ID } from "@/lib/mock-user";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai";
import { created, badRequest, notFound, serverError } from "@/lib/api-response";
import type { FrictionType } from "@/types";

const VALID_FRICTIONS: FrictionType[] = [
  "too_vague", "too_large", "unclear_first_step", "overwhelm",
  "emotional_avoidance", "boredom", "perfectionism",
  "energy_mismatch", "decision_fatigue", "transition_friction",
];

export async function POST(request: Request) {
  try {
    await getOrCreateMockUser();
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Request body must be a JSON object.");
    }

    if (!body.taskId || typeof body.taskId !== "string") {
      return badRequest("taskId is required.");
    }

    const task = await prisma.task.findFirst({
      where: { id: body.taskId, userId: MOCK_USER_ID },
    });
    if (!task) return notFound("Task");

    let frictionType: FrictionType | undefined;
    if (body.frictionType !== undefined) {
      if (!VALID_FRICTIONS.includes(body.frictionType)) {
        return badRequest(
          `Invalid frictionType. Must be one of: ${VALID_FRICTIONS.join(", ")}.`
        );
      }
      frictionType = body.frictionType;
    }

    if (body.stuckDescription && !frictionType) {
      const ai = getAIProvider();
      const classification = await ai.classifyFriction({
        taskTitle: task.title,
        userState: body.stuckDescription,
      });
      frictionType = classification.frictionType;
    }

    const session = await prisma.stuckSession.create({
      data: {
        userId: MOCK_USER_ID,
        taskId: task.id,
        inputChannel: "in_app",
        frictionType: frictionType ?? "unclear_first_step",
        userState: body.stuckDescription ?? null,
      },
    });

    return created(session);
  } catch (err) {
    return serverError("Failed to create stuck session.");
  }
}
