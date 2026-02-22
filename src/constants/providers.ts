export interface ProviderModelInfo {
  id: string;
  displayName: string;
  description: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  description: string;
  models: ProviderModelInfo[];
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-5.2, GPT-5 mini, GPT-5 nano",
    models: [
      {
        id: "gpt-5.2",
        displayName: "GPT-5.2",
        description:
          "The best model for coding and agentic tasks across industries.",
      },
      {
        id: "gpt-5-mini",
        displayName: "GPT-5 mini",
        description:
          "A faster, cost-efficient version of GPT-5 for well-defined tasks.",
      },
      {
        id: "gpt-5-nano",
        displayName: "GPT-5 nano",
        description: "Fastest, most cost-efficient version of GPT-5.",
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5",
    models: [
      {
        id: "claude-opus-4-6",
        displayName: "Claude Opus 4.6",
        description: "The most intelligent model for building agents and coding.",
      },
      {
        id: "claude-sonnet-4-6",
        displayName: "Claude Sonnet 4.6",
        description: "The best combination of speed and intelligence.",
      },
      {
        id: "claude-haiku-4-5",
        displayName: "Claude Haiku 4.5",
        description: "The fastest model with near-frontier intelligence.",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    description: "Gemini 3.1 Pro, Gemini 3 Flash (preview)",
    models: [
      {
        id: "gemini-3.1-pro-preview",
        displayName: "Gemini 3.1 Pro",
        description:
          "Advanced intelligence, complex problem-solving skills, and powerful agentic and vibe coding capabilities. New Preview.",
      },
      {
        id: "gemini-3-flash-preview",
        displayName: "Gemini 3 Flash",
        description:
          "Frontier-class performance rivaling larger models at a fraction of the cost. Preview.",
      },
    ],
  },
];

export const DEFAULT_ENABLED_MODELS: Record<string, string[]> = {
  openai: ["gpt-5-mini"],
  anthropic: ["claude-sonnet-4-6"],
  google: ["gemini-3-flash-preview"],
};
