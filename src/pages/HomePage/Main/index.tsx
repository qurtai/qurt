import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import Message from "@/components/Message";
import Notifications from "@/components/RightSidebar/Notifications";
import { notifications } from "@/mocks/notifications";
import {
  buildChatTitle,
  chatService,
} from "@/services/chat-service";
import type { ChatAttachment } from "@/types/chat-attachment";

type MainProps = {
  hideRightSidebar: boolean;
  onToggleRightSidebar: () => void;
};

const Main = ({ hideRightSidebar, onToggleRightSidebar }: MainProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>(
    [],
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const activeListId =
    new URLSearchParams(location.search).get("list")?.trim() || undefined;

  const addAttachments = async (files: File[]) => {
    if (!window.alem || files.length === 0) {
      return;
    }

    const nextAttachments: ChatAttachment[] = [];

    try {
      for (const file of files) {
        const dataBase64 = await new Promise<string>((resolve, reject) => {
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

        const attachment = await window.alem.saveAttachment({
          name: file.name || "attachment",
          mediaType: file.type || "application/octet-stream",
          dataBase64,
        });

        nextAttachments.push(attachment);
      }
    } catch (unknownError) {
      for (const attachment of nextAttachments) {
        try {
          await window.alem.deleteAttachment(attachment.id);
        } catch {
          // Ignore cleanup errors when a draft upload fails.
        }
      }

      setError(
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to attach one or more files."),
      );
      return;
    }

    setPendingAttachments((current) => [...current, ...nextAttachments]);
    setError(null);
  };

  const removePendingAttachment = async (attachmentId: string) => {
    setPendingAttachments((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );

    try {
      await window.alem.deleteAttachment(attachmentId);
    } catch {
      // Ignore delete failures in draft state.
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const prompt = input.trim();
    if ((!prompt && pendingAttachments.length === 0) || isCreating) {
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const titleSource = prompt || `Attachment: ${pendingAttachments[0]?.name || ""}`;
      const chat = await chatService.createChat(buildChatTitle(titleSource), {
        chatListId: activeListId,
      });
      setInput("");
      setPendingAttachments([]);
      navigate(
        activeListId
          ? `/chat/${chat.id}?list=${encodeURIComponent(activeListId)}`
          : `/chat/${chat.id}`,
        {
          state: {
            initialPrompt: prompt,
            initialAttachments: pendingAttachments,
          },
        },
      );
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to create chat."),
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center grow px-10 md:px-4">
      <div className="absolute top-3 right-10 md:right-4 flex items-center gap-1">
        <Notifications
          items={notifications}
          className="flex justify-center items-center w-10 h-10 rounded-full"
        />
        <button
          className="group flex justify-center items-center w-10 h-10 rounded-full text-0"
          onClick={onToggleRightSidebar}
          title={hideRightSidebar ? "Show sidebar" : "Hide sidebar"}
        >
          <Icon
            className="fill-n-4 transition-colors group-hover:fill-primary-1"
            name="time"
          />
        </button>
      </div>
      <div className="mb-8 text-center">
        <div className="h3 leading-[4rem] 2xl:mb-2 2xl:h4">
          What can I help with?
        </div>
      </div>
      <div className="w-full max-w-[42rem]">
        <Message
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onSubmit={handleSubmit}
          attachments={pendingAttachments}
          onAddFiles={addAttachments}
          onRemoveAttachment={removePendingAttachment}
          placeholder={isCreating ? "Creating chat..." : "Ask anything"}
          centered
        />
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-accent-1/10 text-accent-1 base2">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
