import type { FrictionType } from "@/types";
import type {
  AIProvider,
  FrictionInput,
  FrictionOutput,
  TinyStepInput,
  TinyStepOutput,
  NudgeInput,
  NudgeOutput,
} from "./types";

const GENERIC_STEPS: Record<FrictionType, { nextStep: string; easierVersion: string; rationale: string }> = {
  too_vague: {
    nextStep: "Look at one visible thing related to the task.",
    easierVersion: "Stand near the task area for 1 minute.",
    rationale: "Vague tasks need a concrete visual anchor. Looking at something real makes the next action obvious.",
  },
  too_large: {
    nextStep: "Do the first 2 minutes only. Stop when the timer ends.",
    easierVersion: "Touch the first item related to the task.",
    rationale: "A task that feels big shrinks when you only commit to 2 minutes. No need to finish.",
  },
  unclear_first_step: {
    nextStep: "Pick up the first object you see near the task.",
    easierVersion: "Point at the first thing you would do.",
    rationale: "Any physical first move is better than finding the perfect start. Motion builds momentum.",
  },
  overwhelm: {
    nextStep: "Pick one single item. Handle that one.",
    easierVersion: "Name one item in front of you.",
    rationale: "Removing all choices except one breaks the overwhelm spiral. One thing is manageable.",
  },
  emotional_avoidance: {
    nextStep: "Set a 2-minute timer. Don't do the task. Look at it.",
    easierVersion: "Walk near the task. Leave immediately if you want.",
    rationale: "Neutral exposure without pressure to act lowers the emotional barrier over time.",
  },
  boredom: {
    nextStep: "Race a 2-minute timer. Stop when it ends.",
    easierVersion: "Do the task while listening to something you enjoy.",
    rationale: "A timer reframes boring tasks as a game. Music or audio adds stimulation.",
  },
  perfectionism: {
    nextStep: "Do the rough, unfinished version. Fixing comes later.",
    easierVersion: "Write down what 'good enough' means for this.",
    rationale: "Permission to do a rough draft removes the fear of doing it wrong. Done beats perfect.",
  },
  energy_mismatch: {
    nextStep: "Use the smallest version of one part. 1 minute.",
    easierVersion: "Look at the task while staying seated.",
    rationale: "When energy is low, the only goal is a single micro-action from a comfortable position.",
  },
  decision_fatigue: {
    nextStep: "Pick the closest item to you. Start there.",
    easierVersion: "Touch any one thing near the task.",
    rationale: "Proximity is the fastest way to decide. The nearest object wins, no thinking required.",
  },
  transition_friction: {
    nextStep: "Stand up, then sit back down near the task.",
    easierVersion: "Look toward the task for 10 seconds.",
    rationale: "A physical bridge action resets your context and makes switching feel natural.",
  },
};

const GENERIC_NUDGES: Record<FrictionType, { message: string; actionLabel: string }> = {
  too_vague: {
    message: "Pick one visible spot. Start there.",
    actionLabel: "Show me",
  },
  too_large: {
    message: "Don't finish it. Do 2 minutes.",
    actionLabel: "Start timer",
  },
  unclear_first_step: {
    message: "Touch the first thing you see.",
    actionLabel: "Start",
  },
  overwhelm: {
    message: "No decisions. Touch the first item.",
    actionLabel: "One item",
  },
  emotional_avoidance: {
    message: "Look at it. No action needed.",
    actionLabel: "Look only",
  },
  boredom: {
    message: "Set a 2-minute timer. Stop when it ends.",
    actionLabel: "Go",
  },
  perfectionism: {
    message: "Make the rough version first.",
    actionLabel: "Rough start",
  },
  energy_mismatch: {
    message: "Use the smallest version. 1 minute.",
    actionLabel: "Tiny start",
  },
  decision_fatigue: {
    message: "Closest thing wins. Start there.",
    actionLabel: "That one",
  },
  transition_friction: {
    message: "Stand up. Reset. Then look at it.",
    actionLabel: "Stand up",
  },
};

export class TemplateFallbackProvider implements AIProvider {
  async classifyFriction(_input: FrictionInput): Promise<FrictionOutput> {
    return {
      frictionType: "unclear_first_step",
      confidence: 0.4,
      reason: "Offline fallback: no context available for classification.",
    };
  }

  async generateTinyStep(input: TinyStepInput): Promise<TinyStepOutput> {
    const template = GENERIC_STEPS[input.frictionType] ?? GENERIC_STEPS.unclear_first_step;
    return {
      nextStep: template.nextStep,
      easierVersion: template.easierVersion,
      estimatedMinutes: 1,
      rationale: template.rationale,
      frictionType: input.frictionType,
    };
  }

  async generateNudge(input: NudgeInput): Promise<NudgeOutput> {
    const frictionType: FrictionType = "unclear_first_step";
    const template = GENERIC_NUDGES[frictionType];
    return {
      message: template.message,
      actionLabel: template.actionLabel,
    };
  }
}
