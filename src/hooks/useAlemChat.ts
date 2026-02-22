import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AlemContext } from "../App";
import {
  generateChatReply,
  type AiChatMessage,
  type AiProvider,
} from "../services/ai-service";
import type { ChatAttachment } from "../types/chat-attachment";

export interface ChatMessage extends AiChatMessage {
  id: string;
}

interface UseAlemChatOptions {
  chatId?: string;
  initialMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

function createMessageId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read "${file.name}".`));
    };

    reader.readAsDataURL(file);
  });
}

export function useAlemChat({
  chatId,
  initialMessages = [],
  onMessagesChange,
}: UseAlemChatOptions = {}) {
  const { settings } = useContext(AlemContext);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const activeProvider = settings?.activeProvider;
  const provider: AiProvider =
    activeProvider === "openai" ||
    activeProvider === "anthropic" ||
    activeProvider === "google"
      ? activeProvider
      : "openai";

  const ready = typeof window !== "undefined" && !!window.alem;
  const model = settings?.activeModel || "gpt-5-mini";
  const idPrefix = chatId || "chat";
  const messageSeed = useMemo(
    () =>
      initialMessages
        .map((message) => {
          const attachmentSeed = (message.attachments ?? [])
            .map((attachment) => `${attachment.id}:${attachment.name}:${attachment.size}`)
            .join(",");
          return `${message.id}:${message.role}:${message.content}:${attachmentSeed}`;
        })
        .join("|"),
    [initialMessages],
  );

  useEffect(() => {
    setMessages(initialMessages);
  }, [messageSeed]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const addAttachments = useCallback(
    async (files: File[]) => {
      if (!ready || files.length === 0) {
        return;
      }

      const nextAttachments: ChatAttachment[] = [];

      try {
        for (const file of files) {
          const dataBase64 = await fileToBase64(file);
          const attachment = await window.alem.saveAttachment({
            name: file.name || "attachment",
            mediaType: file.type || "application/octet-stream",
            dataBase64,
          });
          nextAttachments.push(attachment);
        }
      } catch (err) {
        for (const attachment of nextAttachments) {
          try {
            await window.alem.deleteAttachment(attachment.id);
          } catch {
            // Ignore cleanup failures after a partial upload error.
          }
        }

        setError(
          err instanceof Error ? err : new Error("Failed to attach one or more files."),
        );
        return;
      }

      setPendingAttachments((current) => [...current, ...nextAttachments]);
      setError(undefined);
    },
    [ready],
  );

  const removePendingAttachment = useCallback(async (attachmentId: string) => {
    setPendingAttachments((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );

    try {
      await window.alem.deleteAttachment(attachmentId);
    } catch {
      // Ignore delete failures in the draft state.
    }
  }, []);

  const submitPrompt = useCallback(
    async (
      rawPrompt: string,
      attachments: ChatAttachment[] = [],
    ): Promise<boolean> => {
      const prompt = rawPrompt.trim();
      if ((!prompt && attachments.length === 0) || isLoading || !ready) {
        return false;
      }

      const userMessage: ChatMessage = {
        id: createMessageId(idPrefix),
        role: "user",
        content: prompt,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      onMessagesChange?.(nextMessages);
      setError(undefined);
      setIsLoading(true);

      try {
        const apiKey = await window.alem.getApiKey(provider);
        const answer = await generateChatReply({
          provider,
          model,
          apiKey,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
            attachments: message.attachments,
          })),
          resolveAttachmentData: (attachment) =>
            window.alem.readAttachment(attachment.id),
        });

        const assistantMessage: ChatMessage = {
          id: createMessageId(idPrefix),
          role: "assistant",
          content: answer,
        };
        const updatedMessages = [...nextMessages, assistantMessage];
        setMessages(updatedMessages);
        onMessagesChange?.(updatedMessages);

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to get a response from the model."),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [idPrefix, isLoading, messages, model, onMessagesChange, provider, ready],
  );

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const hasSubmitted = await submitPrompt(input, pendingAttachments);
    if (hasSubmitted) {
      setInput("");
      setPendingAttachments([]);
    }
  };

  return {
    messages,
    input,
    pendingAttachments,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    submitPrompt,
    addAttachments,
    removePendingAttachment,
    ready,
    provider,
    model,
  };
}
