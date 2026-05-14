import { getOrCreateMockUser, MOCK_USER_ID } from "@/lib/mock-user";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    await getOrCreateMockUser();
    const interventions = await prisma.intervention.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
      include: { task: { select: { title: true } } },
    });
    return ok(interventions);
  } catch (err) {
    return serverError("Failed to list interventions.");
  }
}

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

    if (!body.triggerType || typeof body.triggerType !== "string") {
      return badRequest("triggerType is required.");
    }

    const data: Record<string, unknown> = {
      userId: MOCK_USER_ID,
      taskId: body.taskId,
      triggerType: body.triggerType,
      channel: body.channel ?? "in_app",
      message: body.message ?? "",
      status: body.status ?? "sent",
      stuckProbability: typeof body.stuckProbability === "number" ? body.stuckProbability : 0.5,
    };

    const intervention = await prisma.intervention.create({
      data: data as never,
    });

    return created(intervention);
  } catch (err) {
    return serverError("Failed to create intervention.");
  }
}
