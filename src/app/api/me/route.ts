import { getOrCreateMockUser } from "@/lib/mock-user";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/lib/api-response";
import type { SupportStyle, StuckSensitivity } from "@/types";

const VALID_STYLES: SupportStyle[] = ["gentle", "direct", "funny", "ultra_minimal"];
const VALID_SENSITIVITIES: StuckSensitivity[] = ["low", "medium", "high"];

export async function GET() {
  try {
    const user = await getOrCreateMockUser();
    return ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileType: user.profileType,
        timezone: user.timezone,
        createdAt: user.createdAt,
      },
      settings: user.settings
        ? {
            supportStyle: user.settings.supportStyle,
            stuckSensitivity: user.settings.stuckSensitivity,
            quietHoursEnabled: user.settings.quietHoursEnabled,
            quietHoursStart: user.settings.quietHoursStart,
            quietHoursEnd: user.settings.quietHoursEnd,
            voiceEnabled: user.settings.voiceEnabled,
            smsEnabled: user.settings.smsEnabled,
            weeklySummaryEnabled: user.settings.weeklySummaryEnabled,
            widgetEnabled: user.settings.widgetEnabled,
            notificationsEnabled: user.settings.notificationsEnabled,
          }
        : null,
    });
  } catch (err) {
    return serverError("Failed to load user.");
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getOrCreateMockUser();
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Request body must be a JSON object.");
    }

    const data: Record<string, unknown> = {};

    if (body.supportStyle !== undefined) {
      if (!VALID_STYLES.includes(body.supportStyle)) {
        return badRequest(
          `Invalid supportStyle. Must be one of: ${VALID_STYLES.join(", ")}.`
        );
      }
      data.supportStyle = body.supportStyle;
    }

    if (body.stuckSensitivity !== undefined) {
      if (!VALID_SENSITIVITIES.includes(body.stuckSensitivity)) {
        return badRequest(
          `Invalid stuckSensitivity. Must be one of: ${VALID_SENSITIVITIES.join(", ")}.`
        );
      }
      data.stuckSensitivity = body.stuckSensitivity;
    }

    if (body.quietHoursStart !== undefined) {
      if (typeof body.quietHoursStart !== "string" || !/^\d{2}:\d{2}$/.test(body.quietHoursStart)) {
        return badRequest("quietHoursStart must be a string in HH:MM format.");
      }
      data.quietHoursStart = body.quietHoursStart;
    }

    if (body.quietHoursEnd !== undefined) {
      if (typeof body.quietHoursEnd !== "string" || !/^\d{2}:\d{2}$/.test(body.quietHoursEnd)) {
        return badRequest("quietHoursEnd must be a string in HH:MM format.");
      }
      data.quietHoursEnd = body.quietHoursEnd;
    }

    if (body.preferredChannels !== undefined) {
      if (!Array.isArray(body.preferredChannels)) {
        return badRequest("preferredChannels must be an array.");
      }
      const validChannels = ["widget", "notification", "sms", "voice", "in_app"];
      for (const ch of body.preferredChannels) {
        if (!validChannels.includes(ch)) {
          return badRequest(`Invalid channel: ${ch}. Must be one of: ${validChannels.join(", ")}.`);
        }
      }
    }

    const updated = await prisma.userSettings.update({
      where: { userId: user.id },
      data,
    });

    return ok({
      supportStyle: updated.supportStyle,
      stuckSensitivity: updated.stuckSensitivity,
      quietHoursEnabled: updated.quietHoursEnabled,
      quietHoursStart: updated.quietHoursStart,
      quietHoursEnd: updated.quietHoursEnd,
      voiceEnabled: updated.voiceEnabled,
      smsEnabled: updated.smsEnabled,
      weeklySummaryEnabled: updated.weeklySummaryEnabled,
      widgetEnabled: updated.widgetEnabled,
      notificationsEnabled: updated.notificationsEnabled,
    });
  } catch (err) {
    return serverError("Failed to update settings.");
  }
}
