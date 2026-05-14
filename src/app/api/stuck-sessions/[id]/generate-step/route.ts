import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";
import { getAIProvider } from "@/lib/ai";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";
import type { FrictionType, EnergyLevel, SupportStyle } from "@/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.stuckSession.findFirst({
      where: { id, userId: MOCK_USER_ID },
    });
    if (!session) return notFound("Stuck session");

    const task = await prisma.task.findFirst({
      where: { id: session.taskId },
    });
    if (!task) return notFound("Task");

    const user = await prisma.user.findUnique({
      where: { id: MOCK_USER_ID },
      include: { settings: true },
    });
    const supportStyle: SupportStyle =
      (user?.settings?.supportStyle as SupportStyle) ?? "gentle";

    const frictionType: FrictionType =
      (session.frictionType as FrictionType) ?? "unclear_first_step";
    const energyLevel: EnergyLevel =
      (task.energyRequired as EnergyLevel) ?? "medium";

    const ai = getAIProvider();
    const step = await ai.generateTinyStep({
      taskTitle: task.title,
      userState: session.userState ?? undefined,
      frictionType,
      energyLevel,
      supportStyle,
      timeAvailableMinutes: 5,
    });

    await prisma.task.update({
      where: { id: task.id },
      data: { currentNextStep: step.nextStep },
    });

    await prisma.stuckSession.update({
      where: { id: session.id },
      data: {
        frictionType: step.frictionType,
        generatedFirstStep: step.nextStep,
      } as never,
    });

    return ok({
      sessionId: session.id,
      taskId: task.id,
      nextStep: step.nextStep,
      easierVersion: step.easierVersion,
      estimatedMinutes: step.estimatedMinutes,
      rationale: step.rationale,
      frictionType: step.frictionType,
    });
  } catch (err) {
    return serverError("Failed to generate step.");
  }
}
