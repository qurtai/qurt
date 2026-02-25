import { useAlemChat } from "@/hooks/useAlemChat";
import type { UIMessage } from "ai";

type UseChatRuntimeOptions = {
  chatId: string;
  initialMessages: UIMessage[];
  terminalWorkspaceOverride?: string;
  onMessagesChange: (messages: UIMessage[], sourceChatId?: string) => Promise<void>;
};

export function useChatRuntime({
  chatId,
  initialMessages,
  terminalWorkspaceOverride,
  onMessagesChange,
}: UseChatRuntimeOptions) {
  return useAlemChat({
    chatId,
    initialMessages,
    onMessagesChange,
    terminalWorkspaceOverride,
  });
}
