import { generateText, type ModelMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { ChatAttachment } from "../types/chat-attachment";

export type AiProvider = "openai" | "anthropic" | "google";

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
}

interface GenerateChatReplyParams {
  provider: AiProvider;
  model: string;
  apiKey: string;
  messages: AiChatMessage[];
  resolveAttachmentData?: (attachment: ChatAttachment) => Promise<string>;
}

const PROVIDER_NAMES: Record<AiProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

function getModel(provider: AiProvider, model: string, apiKey: string) {
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

async function toModelMessages(
  messages: AiChatMessage[],
  resolveAttachmentData?: (attachment: ChatAttachment) => Promise<string>,
): Promise<ModelMessage[]> {
  const modelMessages: ModelMessage[] = [];

  for (const message of messages) {
    const attachments = message.attachments ?? [];
    const hasAttachments = message.role === "user" && attachments.length > 0;

    if (!hasAttachments) {
      modelMessages.push({
        role: message.role,
        content: message.content,
      });
      continue;
    }

    if (!resolveAttachmentData) {
      throw new Error("Attachment resolver is not configured.");
    }

    const contentParts: Array<
      | {
          type: "text";
          text: string;
        }
      | {
          type: "file";
          mediaType: string;
          data: string;
          filename: string;
        }
    > = [];

    if (message.content.trim()) {
      contentParts.push({
        type: "text",
        text: message.content,
      });
    }

    for (const attachment of attachments) {
      const data = await resolveAttachmentData(attachment);
      contentParts.push({
        type: "file",
        mediaType: attachment.mediaType,
        data,
        filename: attachment.name,
      });
    }

    modelMessages.push({
      role: message.role,
      content: contentParts,
    } as ModelMessage);
  }

  return modelMessages;
}

export async function generateChatReply({
  provider,
  model,
  apiKey,
  messages,
  resolveAttachmentData,
}: GenerateChatReplyParams): Promise<string> {
  if (!apiKey.trim()) {
    throw new Error(`${PROVIDER_NAMES[provider]} API key is not configured.`);
  }

  const modelMessages = await toModelMessages(messages, resolveAttachmentData);

  const result = await generateText({
    model: getModel(provider, model, apiKey),
    messages: modelMessages,
  });

  const text = result.text?.trim();
  if (!text) {
    throw new Error("The model returned an empty response.");
  }

  return text;
}
