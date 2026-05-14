import type { AIProvider, FrictionInput, FrictionOutput, TinyStepInput, TinyStepOutput, NudgeInput, NudgeOutput } from "./types";

const NOT_CONFIGURED = "OpenAI provider not configured. Set OPENAI_API_KEY to use cloud AI. The app will use MockAIProvider or TemplateFallbackProvider instead.";

export class OpenAIProviderStub implements AIProvider {
  async classifyFriction(_input: FrictionInput): Promise<FrictionOutput> {
    throw new Error(NOT_CONFIGURED);
  }

  async generateTinyStep(_input: TinyStepInput): Promise<TinyStepOutput> {
    throw new Error(NOT_CONFIGURED);
  }

  async generateNudge(_input: NudgeInput): Promise<NudgeOutput> {
    throw new Error(NOT_CONFIGURED);
  }
}
