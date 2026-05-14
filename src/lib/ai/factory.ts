import type { AIProvider } from "./types";
import { MockAIProvider } from "./mock-provider";
import { TemplateFallbackProvider } from "./template-fallback";
import { OpenAIProviderStub } from "./openai-stub";

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const configured = process.env.AI_PROVIDER || "mock";

  switch (configured) {
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
