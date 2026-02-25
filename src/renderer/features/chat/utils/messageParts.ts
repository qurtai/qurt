import { ALEM_ATTACHMENT_PREFIX } from "@/services/alem-chat-transport";
import {
  getTextFromParts as getTextFromPartsBase,
  getToolPartName,
  getToolStepStatus,
  getAttachmentIdFromUrl as getAttachmentIdFromUrlBase,
  type ChainStepStatus,
} from "@/lib/chat/messageParts";
import type { UIMessage } from "ai";

export {
  getTextFromPartsBase as getTextFromParts,
  getToolPartName,
  getToolStepStatus,
};
export type { ChainStepStatus };

export function getAttachmentIdFromUrl(url: string): string | undefined {
  return getAttachmentIdFromUrlBase(url, ALEM_ATTACHMENT_PREFIX);
}
