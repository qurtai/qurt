import { useMemo } from "react";
import { providerService } from "@/services/provider-service";
import type { UIMessage } from "ai";

type UseChatMetricsOptions = {
  provider: string;
  model: string;
  messages: UIMessage[];
};

export function useChatMetrics({
  provider,
  model,
  messages,
}: UseChatMetricsOptions) {
  const isReasoningModel = useMemo(() => {
    return providerService.isReasoningModel(provider, model);
  }, [model, provider]);

  const tokenUsage = useMemo(() => {
    return providerService.calculateTokenUsage(messages);
  }, [messages]);

  const maxTokens = useMemo(() => {
    return providerService.getMaxTokens(provider, model);
  }, [provider, model]);

  const resolvedModelId = useMemo(() => {
    const resolved = providerService.resolveModel(provider, model);
    return resolved.modelId;
  }, [provider, model]);

  return {
    isReasoningModel,
    tokenUsage,
    maxTokens,
    resolvedModelId,
  };
}
