import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

const VALID_OUTCOMES = ["started", "dismissed", "easier_version", "not_now"];

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

    const session = await prisma.stuckSession.findFirst({
      where: { id, userId: MOCK_USER_ID },
    });
    if (!session) return notFound("Stuck session");

    if (body.outcome !== undefined && !VALID_OUTCOMES.includes(body.outcome)) {
      return badRequest(
        `Invalid outcome. Must be one of: ${VALID_OUTCOMES.join(", ")}.`
      );
    }

    const outcome: string = body.outcome ?? "dismissed";
    const sessionData: Record<string, unknown> = {
      endedAt: new Date(),
    };

    if (outcome === "started") {
      sessionData.acceptedFirstStep = true;
      sessionData.started = true;

      if (body.completed !== undefined) {
        sessionData.completed = Boolean(body.completed);
      }
    } else if (outcome === "easier_version") {
      sessionData.acceptedFirstStep = true;
      sessionData.started = false;
    } else {
      sessionData.acceptedFirstStep = false;
      sessionData.started = false;
    }

    const updated = await prisma.stuckSession.update({
      where: { id: session.id },
      data: sessionData as never,
    });

    let intervention = null;
    if (outcome === "started" || outcome === "easier_version") {
      intervention = await prisma.intervention.create({
        data: {
          userId: MOCK_USER_ID,
          taskId: session.taskId,
          triggerType: "user_tap_stuck",
          channel: "in_app",
          message: body.selectedStep || session.generatedFirstStep || "Started a tiny step.",
          status: outcome === "started" ? "engaged" : "sent",
          stuckProbability: 0.7,
        },
      });

      await prisma.stuckSession.update({
        where: { id: session.id },
        data: { interventionId: intervention.id },
      });
    } else {
      intervention = await prisma.intervention.create({
        data: {
          userId: MOCK_USER_ID,
          taskId: session.taskId,
          triggerType: "user_tap_stuck",
          channel: "in_app",
          message: "Dismissed stuck session.",
          status: "dismissed",
          stuckProbability: 0.7,
        },
      });

      await prisma.stuckSession.update({
        where: { id: session.id },
        data: { interventionId: intervention.id },
      });
    }

    return ok({
      session: updated,
      intervention,
    });
  } catch (err) {
    return serverError("Failed to update stuck session.");
  }
}
