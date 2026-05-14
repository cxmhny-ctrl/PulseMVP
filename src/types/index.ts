export type SupportStyle = "gentle" | "direct" | "funny" | "ultra_minimal";
export type StuckSensitivity = "low" | "medium" | "high";
export type Channel = "widget" | "notification" | "sms" | "voice" | "in_app";
export type TaskStatus = "active" | "completed" | "dismissed";
export type InterventionStatus = "sent" | "engaged" | "dismissed";
export type TaskSource = "voice" | "text" | "template";
export type EnergyLevel = "low" | "medium" | "high";
export type TriggerType =
  | "task_window_start"
  | "missed_task_window"
  | "user_tap_stuck"
  | "sms_reply"
  | "notification_tap"
  | "repeated_snooze";

export type FrictionType =
  | "too_vague"
  | "too_large"
  | "unclear_first_step"
  | "overwhelm"
  | "emotional_avoidance"
  | "boredom"
  | "perfectionism"
  | "energy_mismatch"
  | "decision_fatigue"
  | "transition_friction";

export interface StuckSignal {
  type: string;
  weight: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface StuckScoreResult {
  stuckProbability: number;
  confidence: "low" | "medium" | "high";
  recommendedIntervention: "none" | "widget" | "notification" | "sms" | "in_app";
  detectedSignals: StuckSignal[];
}
