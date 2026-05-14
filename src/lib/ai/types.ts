import type { FrictionType, SupportStyle, EnergyLevel } from "@/types";

export interface FrictionInput {
  taskTitle: string;
  userState?: string;
  context?: string;
}

export interface FrictionOutput {
  frictionType: FrictionType;
  confidence: number;
  reason: string;
}

export interface TinyStepInput {
  taskTitle: string;
  userState?: string;
  frictionType: FrictionType;
  energyLevel: EnergyLevel;
  supportStyle: SupportStyle;
  timeAvailableMinutes?: number;
}

export interface TinyStepOutput {
  nextStep: string;
  easierVersion: string;
  estimatedMinutes: number;
  rationale: string;
  frictionType: FrictionType;
}

export interface NudgeInput {
  taskTitle: string;
  nextStep: string;
  channel: string;
  supportStyle: SupportStyle;
  frictionType?: FrictionType;
}

export interface NudgeOutput {
  message: string;
  actionLabel: string;
}

export interface AIProvider {
  classifyFriction(input: FrictionInput): Promise<FrictionOutput>;
  generateTinyStep(input: TinyStepInput): Promise<TinyStepOutput>;
  generateNudge(input: NudgeInput): Promise<NudgeOutput>;
}
