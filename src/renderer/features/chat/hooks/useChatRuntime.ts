import { useAlemChat } from "@/hooks/useAlemChat";
import type { UIMessage } from "ai";

type UseChatRuntimeOptions = {
  chatId: string;
  initialMessages: UIMessage[];
  workspaceRoot?: string;
  onMessagesChange: (messages: UIMessage[], sourceChatId?: string) => Promise<void>;
};

export function useChatRuntime({
  chatId,
  initialMessages,
  workspaceRoot,
  onMessagesChange,
}: UseChatRuntimeOptions) {
  return useAlemChat({
    chatId,
    initialMessages,
    onMessagesChange,
    workspaceRoot,
  });
}
