import {
  type ChangeEventHandler,
  type ClipboardEvent,
  type FormEventHandler,
  type KeyboardEvent,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import ModelSelector from "@/components/ModelSelector";
import AddFile from "./AddFile";
import Files from "./Files";
import type { ChatAttachment } from "@/types/chat-attachment";

type MessageProps = {
  value: any;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  placeholder?: string;
  image?: string;
  document?: any;
  attachments?: ChatAttachment[];
  onAddFiles?: (files: File[]) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
  centered?: boolean;
};

const Message = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  image,
  document,
  attachments,
  onAddFiles,
  onRemoveAttachment,
  centered,
}: MessageProps) => {
  const hasAttachments = (attachments?.length ?? 0) > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || hasAttachments) && onSubmit) {
        const form = (e.target as HTMLTextAreaElement).closest("form");
        if (form) form.requestSubmit();
      }
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files ?? []);
    if (files.length > 0) {
      onAddFiles?.(files);
    }
  };

  return (
    <div
      className={`relative z-5 w-full ${
        centered
          ? "px-0"
          : "px-10 pb-6 before:absolute before:-top-6 before:left-0 before:right-6 before:bottom-1/2 before:bg-gradient-to-b before:to-n-1 before:from-n-1/0 before:pointer-events-none 2xl:px-6 2xl:pb-5 md:px-4 md:pb-4 dark:before:to-n-6 dark:before:from-n-6/0"
      }`}
    >
      <form onSubmit={onSubmit}>
        <div className="relative z-2 border-2 border-n-3 rounded-2xl dark:border-n-5">
          {(image || document || hasAttachments) && (
            <div className="overflow-hidden rounded-t-2xl">
              <Files
                image={image}
                document={document}
                attachments={attachments}
                onRemoveAttachment={onRemoveAttachment}
              />
            </div>
          )}
          <div className="relative flex items-center min-h-[3.5rem] px-5 pr-14 text-0">
            <TextareaAutosize
              className="w-full py-3 bg-transparent body2 text-n-7 outline-none resize-none placeholder:text-n-4/75 dark:text-n-1 dark:placeholder:text-n-4"
              maxRows={5}
              autoFocus
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder || "Ask Alem anything"}
            />
            {(value !== "" || hasAttachments) && (
              <button
                className="group absolute right-3 bottom-2 w-10 h-10 bg-primary-1 rounded-xl transition-colors hover:bg-primary-1/90"
                type="submit"
              >
                <Icon className="fill-n-1" name="arrow-up" />
              </button>
            )}
          </div>
          <div className="relative flex items-center gap-2 px-3 pb-2.5">
            <AddFile onSelectFiles={onAddFiles} />
            <ModelSelector direction="up" compact />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Message;
