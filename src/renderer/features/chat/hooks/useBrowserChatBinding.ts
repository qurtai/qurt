import { useEffect } from "react";

/**
 * Syncs the active chat ID to the browser tool for per-chat browser windows.
 */
export function useBrowserChatBinding(chatId: string) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.alem?.browserSetActiveChat
    ) {
      return;
    }
    const activeId = chatId?.trim() || null;
    void window.alem.browserSetActiveChat(activeId);
    return () => {
      void window.alem?.browserSetActiveChat?.(null);
    };
  }, [chatId]);
}
