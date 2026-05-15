import OpenAI from "openai";
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
import { TemplateFallbackProvider } from "./template-fallback";

const VALID_FRICTION_TYPES: FrictionType[] = [
  "too_vague",
  "too_large",
  "emotional_avoidance",
  "unclear_first_step",
  "boredom",
  "overwhelm",
  "perfectionism",
  "energy_mismatch",
  "decision_fatigue",
  "transition_friction",
];

function isValidFrictionType(v: string): v is FrictionType {
  return VALID_FRICTION_TYPES.includes(v as FrictionType);
}

function clampConfidence(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function getClient(): OpenAI {
  return new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
    apiKey: process.env.DEEPSEEK_API_KEY || "missing",
  });
}

function getModel(): string {
  return process.env.DEEPSEEK_MODEL || "deepseek-reasoner";
}

function stripReasoning(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return messages.map((m) => {
    const copy = { ...m };
    if ("reasoning_content" in copy) {
      delete (copy as Record<string, unknown>).reasoning_content;
    }
    return copy;
  });
}

async function safeJsonComplete(
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  const client = getClient();
  const model = getModel();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const res = await client.chat.completions.create({
    model,
    messages: stripReasoning(messages),
    response_format: { type: "json_object" },
    temperature: 1.0,
    max_tokens: 400,
  });

  const raw = res.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty DeepSeek response");

  try {
    return JSON.parse(raw);
  } catch {
    // Try to extract JSON from markdown fences
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse DeepSeek JSON response");
  }
}

const CLASSIFY_SYSTEM = `You are a calm, non-clinical assistant that classifies why someone feels stuck starting a task.
You must respond with valid JSON only. Include the word json in your thinking.
Return exactly: {"frictionType":"<type>","confidence":<0.0-1.0>,"reasoning":"<short explanation>"}
Valid frictionType values: too_vague, too_large, emotional_avoidance, unclear_first_step, boredom, overwhelm, perfectionism, energy_mismatch, decision_fatigue, transition_friction.
Use the user's description to pick the best match. Confidence reflects how clearly their words match the type.`;

const TINY_STEP_SYSTEM = `You are a calm, supportive assistant for people with ADHD. You break stuck tasks into tiny, concrete physical actions.

CRITICAL — Tiny step rules:
- Every tiny step must involve exactly ONE object, ONE surface, ONE location, or ONE physical action.
- REJECTED words (never use): all, entire, everything, whole, every, clean up, organize, finish, complete, tidy, clear
- CORRECT: "Pick up one dirty plate and put it in the sink"
- WRONG:   "Pick up all trash from counters and put in bin"
- WRONG:   "Clean up the entire kitchen counter"
- Each step must be achievable in 2 minutes or less.
- Prefer a single touch, lift, move, or wipe of one specific item.

Tone rules:
- No shame, no guilt, no motivational cliches
- Never say "just" or "simply"
- No diagnosis or treatment language
- Speak calmly, directly, in under 20 words

Respond with valid JSON only. Include the word json.
Return: {"tinyStep":"<one physical action under 2 min>","easierVersion":"<even simpler version>","estimatedMinutes":<1-2>,"rationale":"<short explanation>","frictionType":"<same type from input>"}`;

const NUDGE_SYSTEM = `You are a calm, non-shaming assistant. You write brief nudges for an ADHD companion app.
Tone rules:
- No shame, no guilt
- Never say "just" or "simply"
- Under 20 words
- Concrete and physical
- No diagnosis/treatment language
Respond with valid JSON only. Include the word json.
Return: {"message":"<nudge message under 20 words>","actionLabel":"<short 1-3 word button label>"}`;

// Broad-word patterns that violate the single-object/single-action rule
const BROAD_PATTERN = /\b(all\s|entire|everything\b|whole\b|every\b|clean\s*up|organize|finish\b|complete\b|tidy\b|clear\s*(up|out))\b/i;

export function isStepTooBroad(step: string): boolean {
  return BROAD_PATTERN.test(step);
}

// Safe deterministic tiny steps keyed by task title keywords.
// These produce natural, specific language — never "one trash" or "one kitchen".
interface SafeStep {
  nextStep: string;
  easierVersion: string;
}

export function getSafeStep(taskTitle: string): SafeStep {
  const t = taskTitle.toLowerCase();

  if (t.includes("kitchen") || t.includes("dishes") || t.includes("counter") || t.includes("sink")) {
    return {
      nextStep: "Pick up one item from the counter and put it where it belongs.",
      easierVersion: "Pick up one piece of trash and throw it away.",
    };
  }
  if (t.includes("laundry") || t.includes("clothes") || t.includes("hamper") || t.includes("basket")) {
    return {
      nextStep: "Put one piece of clothing into the hamper.",
      easierVersion: "Pick up one sock.",
    };
  }
  if (t.includes("email") || t.includes("inbox") || t.includes("message") || t.includes("reply")) {
    return {
      nextStep: "Open the email and read the first sentence.",
      easierVersion: "Open your inbox.",
    };
  }
  if (t.includes("floor") || t.includes("vacuum") || t.includes("sweep")) {
    return {
      nextStep: "Pick up one item from the floor.",
      easierVersion: "Stand on the floor and look around for 10 seconds.",
    };
  }
  if (t.includes("desk") || t.includes("table") || t.includes("workspace")) {
    return {
      nextStep: "Pick up one item from your desk and put it away.",
      easierVersion: "Touch one thing on your desk.",
    };
  }
  if (t.includes("bathroom") || t.includes("shower") || t.includes("toilet") || t.includes("mirror")) {
    return {
      nextStep: "Wipe one section of the bathroom counter with a cloth.",
      easierVersion: "Pick up one item from the bathroom floor.",
    };
  }

  return {
    nextStep: "Pick one visible item related to this task and touch it.",
    easierVersion: "Look at the task area for ten seconds.",
  };
}

export class DeepSeekProvider implements AIProvider {
  private fallback = new TemplateFallbackProvider();
  private enabled: boolean;

  constructor() {
    this.enabled = !!process.env.DEEPSEEK_API_KEY;
    if (!this.enabled) {
      console.warn("DeepSeekProvider: DEEPSEEK_API_KEY not set. Using template fallback.");
    }
  }

  async classifyFriction(input: FrictionInput): Promise<FrictionOutput> {
    if (!this.enabled) return this.fallback.classifyFriction(input);

    try {
      const userPrompt = `Task: "${input.taskTitle}"
User description: ${input.userState || "(none provided)"}
Additional context: ${input.context || "(none)"}`;

      const json = await safeJsonComplete(CLASSIFY_SYSTEM, userPrompt);

      const frictionType = String(json.frictionType || "");
      if (!isValidFrictionType(frictionType)) {
        throw new Error(`Invalid frictionType: ${frictionType}`);
      }

      return {
        frictionType,
        confidence: clampConfidence(Number(json.confidence) || 0.5),
        reason: String(json.reasoning || json.reason || "No reason provided"),
      };
    } catch (err) {
      console.error("DeepSeek classifyFriction failed:", err);
      return this.fallback.classifyFriction(input);
    }
  }

  async generateTinyStep(input: TinyStepInput): Promise<TinyStepOutput> {
    if (!this.enabled) return this.fallback.generateTinyStep(input);

    try {
      const userPrompt = `Task: "${input.taskTitle}"
Friction type: ${input.frictionType}
Energy level: ${input.energyLevel}
Support style: ${input.supportStyle}
User state: ${input.userState || "(none)"}
Time available: ${input.timeAvailableMinutes || 5} minutes`;

      const json = await safeJsonComplete(TINY_STEP_SYSTEM, userPrompt);

      const nextStep = String(json.tinyStep || "");
      const easierVersion = String(json.easierVersion || "");
      const estimatedMinutes = Math.max(1, Math.min(2, Number(json.estimatedMinutes) || 2));
      const rationale = String(json.rationale || "Small actions build momentum.");
      const frictionType = String(json.frictionType || input.frictionType);

      if (!nextStep || !easierVersion) {
        throw new Error("Missing required fields in tiny step response");
      }

      // Validate: reject steps that are too broad (contain "all", "everything", etc.)
      if (isStepTooBroad(nextStep)) {
        const safe = getSafeStep(input.taskTitle);
        console.warn(`DeepSeek step was too broad, replaced: "${nextStep}" → "${safe.nextStep}"`);
        return {
          nextStep: safe.nextStep,
          easierVersion: safe.easierVersion,
          estimatedMinutes: 1,
          rationale: "Replaced a broad step with a safe single-object action.",
          frictionType: input.frictionType,
        };
      }

      return {
        nextStep,
        easierVersion,
        estimatedMinutes,
        rationale,
        frictionType: isValidFrictionType(frictionType) ? frictionType : input.frictionType,
      };
    } catch (err) {
      console.error("DeepSeek generateTinyStep failed:", err);
      return this.fallback.generateTinyStep(input);
    }
  }

  async generateNudge(input: NudgeInput): Promise<NudgeOutput> {
    if (!this.enabled) return this.fallback.generateNudge(input);

    try {
      const userPrompt = `Task: "${input.taskTitle}"
Next step: "${input.nextStep}"
Channel: ${input.channel}
Style: ${input.supportStyle}
Friction type: ${input.frictionType || "unclear_first_step"}`;

      const json = await safeJsonComplete(NUDGE_SYSTEM, userPrompt);

      const message = String(json.message || "");
      const actionLabel = String(json.actionLabel || "");

      if (!message || !actionLabel) {
        throw new Error("Missing required fields in nudge response");
      }

      return {
        message: message.substring(0, 200),
        actionLabel: actionLabel.substring(0, 30),
      };
    } catch (err) {
      console.error("DeepSeek generateNudge failed:", err);
      return this.fallback.generateNudge(input);
    }
  }
}
