import { ToolLoopAgent, stepCountIs, type ToolSet } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { resolveProviderModel } from "@/constants/providers";
import { getToolSetForProvider } from "@/tools";
import type { PromptMode } from "../types/prompt-mode";

export type AiProvider = "openai" | "anthropic" | "google";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

const PROVIDER_NAMES: Record<AiProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

export function getModel(provider: AiProvider, model: string, apiKey: string) {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })(model);
    case "anthropic":
      return createAnthropic({ apiKey })(model);
    case "google":
      return createGoogleGenerativeAI({ apiKey })(model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export interface CreateAgentParams {
  provider: AiProvider;
  model: string;
  apiKey: string;
  mode?: PromptMode;
  terminalWorkspaceOverride?: string;
}

const AGENT_INSTRUCTIONS =
  "You are a helpful assistant. Use web search when live or recent information is required. Use run_terminal only for running single commands in the user's workspace (e.g. git status, npm run build); pass command as tokens; commands run in the chat's workspace folder, network is disabled by default. Use apply_file_patch to edit workspace files via unified diff or strict patch DSL; paths are relative to workspace root, binary files are blocked.";

export function createAgent({
  provider,
  model,
  apiKey,
  mode = "ask",
  terminalWorkspaceOverride,
}: CreateAgentParams): ToolLoopAgent {
  if (!apiKey.trim()) {
    throw new Error(`${PROVIDER_NAMES[provider]} API key is not configured.`);
  }

  const resolvedModel = resolveProviderModel(provider, model);
  const providerOptionsMap: Record<string, { [key: string]: JsonValue | undefined }> = {};

  if (provider === "openai" && resolvedModel.reasoningEffort) {
    providerOptionsMap.openai = {
      reasoningEffort: resolvedModel.reasoningEffort,
      reasoningSummary: "auto",
    };
  }

  if (provider === "google" && resolvedModel.googleThinkingLevel) {
    providerOptionsMap.google = {
      thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: resolvedModel.googleThinkingLevel,
      },
    };
  }

  if (provider === "anthropic" && resolvedModel.anthropicThinkingBudgetTokens) {
    providerOptionsMap.anthropic = {
      thinking: {
        type: "enabled",
        budgetTokens: resolvedModel.anthropicThinkingBudgetTokens,
      },
    };
  }

  const providerOptions =
    Object.keys(providerOptionsMap).length > 0 ? providerOptionsMap : undefined;

  const tools: ToolSet | undefined =
    mode === "agent"
      ? getToolSetForProvider(provider, apiKey, { terminalWorkspaceOverride })
      : undefined;

  return new ToolLoopAgent({
    model: getModel(provider, resolvedModel.modelId, apiKey),
    tools,
    stopWhen: mode === "agent" ? stepCountIs(5) : undefined,
    instructions: AGENT_INSTRUCTIONS,
    providerOptions,
  });
}
