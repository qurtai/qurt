import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import { type ChatMessage, useAlemChat } from "@/hooks/useAlemChat";
import type { ChatAttachment } from "@/types/chat-attachment";
import {
  chatService,
  type ChatSession,
} from "@/services/chat-service";

type ChatPageLocationState = {
  initialPrompt?: string;
  initialAttachments?: ChatAttachment[];
};

const ChatPage = () => {
  const { chatId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [hideRightSidebar, setHideRightSidebar] = useState(false);
  const sentInitialPromptRef = useRef(false);

  const initialPrompt = useMemo(() => {
    const state = location.state as ChatPageLocationState | null;
    return state?.initialPrompt?.trim() || "";
  }, [location.state]);
  const initialAttachments = useMemo(() => {
    const state = location.state as ChatPageLocationState | null;
    return state?.initialAttachments ?? [];
  }, [location.state]);
  const activeListId = useMemo(
    () => new URLSearchParams(location.search).get("list")?.trim() || "",
    [location.search],
  );

  const initialMessages = chat?.messages ?? [];

  const handleMessagesChange = useCallback(
    async (messages: ChatMessage[]) => {
      if (!chatId || isLoadingChat) {
        return;
      }

      const updated = await chatService.saveMessages(chatId, messages);
      if (updated) {
        setChat(updated);
      }
    },
    [chatId, isLoadingChat],
  );

  const {
    messages,
    input,
    pendingAttachments,
    handleInputChange,
    handleSubmit,
    submitPrompt,
    addAttachments,
    removePendingAttachment,
    isLoading,
    error,
  } = useAlemChat({
    chatId,
    initialMessages,
    onMessagesChange: handleMessagesChange,
  });

  useEffect(() => {
    let isMounted = true;

    const loadChat = async () => {
      if (!chatId) {
        navigate(
          activeListId ? `/?list=${encodeURIComponent(activeListId)}` : "/",
          { replace: true },
        );
        return;
      }

      setIsLoadingChat(true);
      const existingChat = await chatService.getChat(chatId);

      if (!isMounted) {
        return;
      }

      if (!existingChat) {
        navigate(
          activeListId ? `/?list=${encodeURIComponent(activeListId)}` : "/",
          { replace: true },
        );
        return;
      }

      setChat(existingChat);
      setIsLoadingChat(false);
    };

    void loadChat();

    return () => {
      isMounted = false;
    };
  }, [activeListId, chatId, navigate]);

  useEffect(() => {
    if (
      !chat ||
      sentInitialPromptRef.current ||
      (!initialPrompt && initialAttachments.length === 0)
    ) {
      return;
    }

    if (chat.messages.length > 0) {
      sentInitialPromptRef.current = true;
      return;
    }

    sentInitialPromptRef.current = true;
    void submitPrompt(initialPrompt, initialAttachments);
  }, [chat, initialAttachments, initialPrompt, submitPrompt]);

  if (isLoadingChat) {
    return (
      <Layout>
        <div className="flex grow items-center justify-center px-10 md:px-4">
          <div className="base2 text-n-4/75">Loading chat...</div>
        </div>
      </Layout>
    );
  }

  if (!chat) {
    return null;
  }

  return (
    <Layout hideRightSidebar={hideRightSidebar}>
      <Chat
        chatId={chat.id}
        chatListIds={chat.chatListIds}
        title={chat.title}
        hideRightSidebar={hideRightSidebar}
        onToggleRightSidebar={() => setHideRightSidebar((prev) => !prev)}
      >
        {messages.map((message) =>
          message.role === "user" ? (
            <Question
              key={message.id}
              content={message.content}
              attachments={message.attachments}
              time="Just now"
            />
          ) : (
            <Answer key={message.id} time="Just now">
              <div className="whitespace-pre-wrap">{message.content}</div>
            </Answer>
          ),
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <Answer loading />
        )}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-accent-1/10 text-accent-1 base2">
            {error.message}
          </div>
        )}
      </Chat>
      <Message
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        attachments={pendingAttachments}
        onAddFiles={addAttachments}
        onRemoveAttachment={removePendingAttachment}
        placeholder="Ask anything"
      />
    </Layout>
  );
};

export default ChatPage;
