import type { AIProvider } from "./types";
import { MockAIProvider } from "./mock-provider";
import { TemplateFallbackProvider } from "./template-fallback";
import { OpenAIProviderStub } from "./openai-stub";
import { DeepSeekProvider } from "./deepseek-provider";

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const configured = process.env.AI_PROVIDER || "mock";

  switch (configured) {
    case "deepseek":
      cachedProvider = new DeepSeekProvider();
      break;
    case "openai":
      cachedProvider = new OpenAIProviderStub();
      break;
    case "fallback":
      cachedProvider = new TemplateFallbackProvider();
      break;
    case "mock":
    default:
      cachedProvider = new MockAIProvider();
      break;
  }

  return cachedProvider;
}

export function resetAIProvider(): void {
  cachedProvider = null;
}
