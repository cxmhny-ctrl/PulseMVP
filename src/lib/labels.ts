const LABEL_MAP: Record<string, string> = {
  in_app: "In-app",
  widget: "Widget",
  notification: "Notification",
  sms: "SMS",
  voice: "Voice",

  too_vague: "Too vague",
  too_large: "Too large",
  unclear_first_step: "Unclear first step",
  overwhelm: "Overwhelm",
  emotional_avoidance: "Emotional avoidance",
  boredom: "Boredom",
  perfectionism: "Perfectionism",
  energy_mismatch: "Energy mismatch",
  decision_fatigue: "Decision fatigue",
  transition_friction: "Transition friction",

  low: "Low energy",
  medium: "Medium energy",
  high: "High energy",

  gentle: "Gentle",
  direct: "Direct",
  funny: "Funny",
  ultra_minimal: "Ultra-minimal",

  user_tap_stuck: "Stuck tap",
  scheduled_check: "Scheduled check",
  system_detected: "System detected",

  engaged: "Started",
  sent: "Nudged",
  dismissed: "Dismissed",
};

export function formatLabel(key: string | null | undefined): string {
  if (!key) return "";
  return LABEL_MAP[key] ?? key.replace(/_/g, " ");
}

const HUMANIZE_ORDER = Object.keys(LABEL_MAP).sort(
  (a, b) => b.length - a.length
);

export function humanizeText(text: string): string {
  let result = text;
  // Remove quotes around labels: "in_app" → in_app
  result = result.replace(/"([a-z][a-z_]+)"/g, "$1");
  // Replace known keys (longest first to avoid partial matches)
  for (const key of HUMANIZE_ORDER) {
    const re = new RegExp(`\\b${key.replace(/_/g, "_")}\\b`, "gi");
    result = result.replace(re, LABEL_MAP[key]);
  }
  return result;
}
