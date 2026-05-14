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

const KEYWORD_MAP: { keywords: string[]; type: FrictionType }[] = [
  {
    keywords: [
      "don't want",
      "hate",
      "dread",
      "avoiding",
      "can't stand",
      "resent",
      "annoying",
    ],
    type: "emotional_avoidance",
  },
  {
    keywords: [
      "switch",
      "stop doing",
      "move from",
      "change task",
      "different thing",
      "was doing",
      "in the middle",
    ],
    type: "transition_friction",
  },
  {
    keywords: [
      "decide",
      "choices",
      "options",
      "which one",
      "can't pick",
      "prioritize",
    ],
    type: "decision_fatigue",
  },
  {
    keywords: [
      "boring",
      "tedious",
      "monotonous",
      "dull",
      "not interesting",
      "no fun",
    ],
    type: "boredom",
  },
  {
    keywords: [
      "perfect",
      "right way",
      "wrong",
      "mess up",
      "mistake",
      "not good enough",
      "properly",
    ],
    type: "perfectionism",
  },
  {
    keywords: [
      "tired",
      "exhausted",
      "no energy",
      "drained",
      "worn out",
      "fatigue",
      "can't move",
    ],
    type: "energy_mismatch",
  },
  {
    keywords: [
      "overwhelm",
      "too much",
      "everything",
      "disaster",
      "chaos",
      "can't handle",
      "so many",
      "pile",
    ],
    type: "overwhelm",
  },
  {
    keywords: [
      "don't know where",
      "not sure how",
      "where to start",
      "where to begin",
      "how to start",
      "first step",
      "start point",
      "how do i",
    ],
    type: "unclear_first_step",
  },
  {
    keywords: [
      "too vague",
      "not clear",
      "unclear",
      "don't know what",
      "what exactly",
      "confused",
    ],
    type: "too_vague",
  },
  {
    keywords: ["too big", "huge", "enormous", "massive", "so much"],
    type: "too_large",
  },
];

function classifyByKeywords(userState: string): FrictionType {
  const lower = userState.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.type;
    }
  }
  return "unclear_first_step";
}

function frictionReason(type: FrictionType, taskTitle: string): string {
  const reasons: Record<FrictionType, string> = {
    too_vague: `"${taskTitle}" is not specific enough to act on.`,
    too_large: `"${taskTitle}" feels too big to start.`,
    unclear_first_step: `The first physical action for "${taskTitle}" is unclear.`,
    overwhelm: `"${taskTitle}" triggers a sense of too many things at once.`,
    emotional_avoidance: `"${taskTitle}" carries emotional weight that makes starting hard.`,
    boredom: `"${taskTitle}" lacks stimulation or novelty.`,
    perfectionism: `There is pressure to do "${taskTitle}" perfectly.`,
    energy_mismatch: `Current energy is too low for "${taskTitle}".`,
    decision_fatigue: `Too many choices inside "${taskTitle}" are blocking action.`,
    transition_friction: `Switching context to "${taskTitle}" is difficult right now.`,
  };
  return reasons[type];
}

const STEP_TEMPLATES: Record<
  FrictionType,
  (taskTitle: string) => { nextStep: string; easierVersion: string; rationale: string }
> = {
  too_vague: (t) => ({
    nextStep: `Look at one visible item related to ${t}.`,
    easierVersion: `Stand near ${t} for 1 minute.`,
    rationale: "A vague task needs a concrete visual anchor.",
  }),
  too_large: (t) => ({
    nextStep: `Do 2 minutes of ${t}. Stop after 2 minutes.`,
    easierVersion: `Touch the first item for ${t}.`,
    rationale: "Shrinking to a 2-minute window removes the size barrier.",
  }),
  unclear_first_step: (t) => ({
    nextStep: `Pick up the first object you see for ${t}.`,
    easierVersion: `Point at the first thing you would do for ${t}.`,
    rationale: "A physical first move defines the starting point.",
  }),
  overwhelm: (t) => ({
    nextStep: `Pick one item related to ${t}. Handle that one.`,
    easierVersion: `Name one thing in front of you for ${t}.`,
    rationale: "Removing choices reduces the overwhelm of too many demands.",
  }),
  emotional_avoidance: (t) => ({
    nextStep: `Set a 2-minute timer and look at ${t}.`,
    easierVersion: `Walk near ${t}. Don't touch anything.`,
    rationale: "Neutral exposure lowers the emotional barrier.",
  }),
  boredom: (t) => ({
    nextStep: `Race a 2-minute timer on ${t}.`,
    easierVersion: `Do ${t} while listening to something.`,
    rationale: "Adding a timer or novelty makes boring tasks stimulating.",
  }),
  perfectionism: (t) => ({
    nextStep: `Do the rough, ugly version of ${t} for 2 minutes.`,
    easierVersion: `Write down what "good enough" looks like for ${t}.`,
    rationale: "Permission to do it poorly removes the perfection block.",
  }),
  energy_mismatch: (t) => ({
    nextStep: `Do the seated version of ${t} for 1 minute.`,
    easierVersion: `Look at ${t} while sitting down.`,
    rationale: "Matching energy level to a tiny seated action makes starting possible.",
  }),
  decision_fatigue: (t) => ({
    nextStep: `Pick the closest item for ${t}. Start with that.`,
    easierVersion: `Touch any one thing near ${t}.`,
    rationale: "Eliminating decisions by choosing proximity removes the choice burden.",
  }),
  transition_friction: (t) => ({
    nextStep: `Stand up, then sit back down near ${t}.`,
    easierVersion: `Look toward ${t} for 10 seconds.`,
    rationale: "A bridge action creates a physical transition between activities.",
  }),
};

const NUDGE_TEMPLATES: Record<
  FrictionType,
  (taskTitle: string, nextStep: string) => { message: string; actionLabel: string }
> = {
  too_vague: (t, s) => ({
    message: `Want a small first move for "${t}"?`,
    actionLabel: "Show me",
  }),
  too_large: (t) => ({
    message: `Try 2 minutes of "${t}". You can stop.`,
    actionLabel: "Start timer",
  }),
  unclear_first_step: (t) => ({
    message: `Pick the closest thing for "${t}".`,
    actionLabel: "Got it",
  }),
  overwhelm: (t) => ({
    message: `One item for "${t}". That's it.`,
    actionLabel: "One item",
  }),
  emotional_avoidance: (t) => ({
    message: `Look at "${t}" for a moment.`,
    actionLabel: "Look only",
  }),
  boredom: (t) => ({
    message: `2-minute speed round for "${t}"?`,
    actionLabel: "Go",
  }),
  perfectionism: (t) => ({
    message: `Rough version of "${t}" counts.`,
    actionLabel: "Rough start",
  }),
  energy_mismatch: (t) => ({
    message: `Seated version of "${t}". 1 minute.`,
    actionLabel: "Start seated",
  }),
  decision_fatigue: (t) => ({
    message: `Closest thing to you for "${t}".`,
    actionLabel: "That one",
  }),
  transition_friction: (t) => ({
    message: `Stand up. That's your step for "${t}".`,
    actionLabel: "Stand up",
  }),
};

export class MockAIProvider implements AIProvider {
  async classifyFriction(input: FrictionInput): Promise<FrictionOutput> {
    const userState = input.userState || "";
    const frictionType = classifyByKeywords(userState);
    return {
      frictionType,
      confidence: 0.85,
      reason: frictionReason(frictionType, input.taskTitle),
    };
  }

  async generateTinyStep(input: TinyStepInput): Promise<TinyStepOutput> {
    const template = STEP_TEMPLATES[input.frictionType];
    const { nextStep, easierVersion, rationale } = template(input.taskTitle);
    return {
      nextStep,
      easierVersion,
      estimatedMinutes: Math.min(input.timeAvailableMinutes ?? 2, 2),
      rationale,
      frictionType: input.frictionType,
    };
  }

  async generateNudge(input: NudgeInput): Promise<NudgeOutput> {
    const frictionType = input.frictionType || classifyByKeywords(input.taskTitle);
    const template = NUDGE_TEMPLATES[frictionType] ?? NUDGE_TEMPLATES.unclear_first_step;
    const { message, actionLabel } = template(input.taskTitle, input.nextStep);
    return { message, actionLabel };
  }
}
