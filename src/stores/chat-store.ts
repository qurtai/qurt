import type { UIMessage } from "ai";
import { ARCHIVED_CHAT_GROUP_ID } from "./chat-group-store";

const STORAGE_KEY = "alem.chat-history.v2";
export const CHAT_HISTORY_UPDATED_EVENT = "alem:chat-history-updated";
export const DEFAULT_CHAT_TITLE = "New chat";

export interface ChatSession {
  id: string;
  title: string;
  messages: UIMessage[];
  chatGroupIds: string[];
  isArchived: boolean;
  /** Optional workspace root for terminal tool; one per chat. */
  terminalWorkspacePath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistoryStorage {
  readSessions(): Promise<ChatSession[]>;
  writeSessions(sessions: ChatSession[]): Promise<void>;
}

export interface ChatStore {
  readSessions(): Promise<ChatSession[]>;
  getChat(chatId: string): Promise<ChatSession | null>;
  createChat(
    title: string,
    options?: {
      chatGroupIds?: string[];
      isArchived?: boolean;
      terminalWorkspacePath?: string;
    },
  ): Promise<ChatSession>;
  updateChat(
    chatId: string,
    update: {
      title?: string;
      messages?: UIMessage[];
      chatGroupIds?: string[];
      isArchived?: boolean;
      terminalWorkspacePath?: string;
    },
  ): Promise<ChatSession | null>;
  archiveChats(chatIds: string[]): Promise<void>;
  deleteChats(chatIds: string[]): Promise<void>;
  clearChats(): Promise<void>;
}

class LocalStorageChatHistoryStorage implements ChatHistoryStorage {
  async readSessions(): Promise<ChatSession[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return normalizeSessions(parsed);
    } catch {
      return [];
    }
  }

  async writeSessions(sessions: ChatSession[]): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

function createChatId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeChatGroupIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const groupIds = value
    .filter((groupId): groupId is string => typeof groupId === "string")
    .map((groupId) => groupId.trim())
    .filter((groupId) => groupId.length > 0);

  return [...new Set(groupIds)];
}

function syncArchiveGroup(
  chatGroupIds: string[],
  isArchived: boolean,
): string[] {
  const next = new Set(chatGroupIds);

  if (isArchived) {
    next.add(ARCHIVED_CHAT_GROUP_ID);
    return [...next];
  }

  next.delete(ARCHIVED_CHAT_GROUP_ID);

  return [...next];
}

function isValidUIMessage(value: unknown): value is UIMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const m = value as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    (m.role === "system" || m.role === "user" || m.role === "assistant") &&
    Array.isArray(m.parts)
  );
}

function normalizeSessions(value: unknown): ChatSession[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const candidate = item as Partial<ChatSession>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.createdAt !== "string" ||
        typeof candidate.updatedAt !== "string" ||
        !Array.isArray(candidate.messages)
      ) {
        return null;
      }

      const messages: UIMessage[] = candidate.messages.filter(
        isValidUIMessage,
      ) as UIMessage[];

      const rawIds = (candidate as Record<string, unknown>).chatGroupIds ?? (candidate as Record<string, unknown>).chatListIds;
      const normalizedChatGroupIds = normalizeChatGroupIds(rawIds);
      const isArchived =
        candidate.isArchived === true ||
        normalizedChatGroupIds.includes(ARCHIVED_CHAT_GROUP_ID);

      const terminalWorkspacePath =
        typeof candidate.terminalWorkspacePath === "string" &&
        candidate.terminalWorkspacePath.trim()
          ? candidate.terminalWorkspacePath.trim()
          : undefined;

      const session: ChatSession = {
        id: candidate.id,
        title: candidate.title || DEFAULT_CHAT_TITLE,
        messages,
        chatGroupIds: syncArchiveGroup(normalizedChatGroupIds, isArchived),
        isArchived,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      };
      if (terminalWorkspacePath !== undefined) {
        session.terminalWorkspacePath = terminalWorkspacePath;
      }
      return session;
    })
    .filter((session): session is ChatSession => session !== null);
}

function emitChatHistoryUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHAT_HISTORY_UPDATED_EVENT));
}

export class BrowserChatStore implements ChatStore {
  constructor(
    private readonly storage: ChatHistoryStorage = new LocalStorageChatHistoryStorage(),
  ) {}

  async readSessions(): Promise<ChatSession[]> {
    return this.storage.readSessions();
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    const sessions = await this.storage.readSessions();
    return sessions.find((session) => session.id === chatId) ?? null;
  }

  async createChat(
    title: string,
    options?: {
      chatGroupIds?: string[];
      isArchived?: boolean;
      terminalWorkspacePath?: string;
    },
  ): Promise<ChatSession> {
    const now = new Date().toISOString();
    const requestedGroupIds = normalizeChatGroupIds(options?.chatGroupIds);
    const isArchived = options?.isArchived ?? requestedGroupIds.includes(ARCHIVED_CHAT_GROUP_ID);
    const terminalWorkspacePath =
      typeof options?.terminalWorkspacePath === "string" &&
      options.terminalWorkspacePath.trim()
        ? options.terminalWorkspacePath.trim()
        : undefined;
    const session: ChatSession = {
      id: createChatId(),
      title: title.trim() || DEFAULT_CHAT_TITLE,
      messages: [],
      chatGroupIds: syncArchiveGroup(requestedGroupIds, isArchived),
      isArchived,
      terminalWorkspacePath,
      createdAt: now,
      updatedAt: now,
    };

    const sessions = await this.storage.readSessions();
    await this.storage.writeSessions([session, ...sessions]);
    emitChatHistoryUpdated();
    return session;
  }

  async updateChat(
    chatId: string,
    update: {
      title?: string;
      messages?: UIMessage[];
      chatGroupIds?: string[];
      isArchived?: boolean;
      terminalWorkspacePath?: string;
    },
  ): Promise<ChatSession | null> {
    const sessions = await this.storage.readSessions();
    const index = sessions.findIndex((session) => session.id === chatId);

    if (index === -1) {
      return null;
    }

    const current = sessions[index];
    const nextIsArchived = update.isArchived ?? current.isArchived;
    const requestedGroupIds = normalizeChatGroupIds(update.chatGroupIds ?? current.chatGroupIds);
    const nextWorkspacePath =
      update.terminalWorkspacePath !== undefined
        ? (typeof update.terminalWorkspacePath === "string" &&
          update.terminalWorkspacePath.trim()
            ? update.terminalWorkspacePath.trim()
            : undefined)
        : current.terminalWorkspacePath;
    const updatedSession: ChatSession = {
      ...current,
      title: update.title ?? current.title,
      messages: update.messages ?? current.messages,
      chatGroupIds: syncArchiveGroup(requestedGroupIds, nextIsArchived),
      isArchived: nextIsArchived,
      terminalWorkspacePath: nextWorkspacePath,
      updatedAt: new Date().toISOString(),
    };

    const nextSessions = [...sessions];
    nextSessions[index] = updatedSession;
    await this.storage.writeSessions(nextSessions);
    emitChatHistoryUpdated();
    return updatedSession;
  }

  async archiveChats(chatIds: string[]): Promise<void> {
    if (chatIds.length === 0) {
      return;
    }

    const chatIdsSet = new Set(chatIds);
    const sessions = await this.storage.readSessions();
    let didChange = false;
    const now = new Date().toISOString();
    const nextSessions = sessions.map((session) => {
      if (!chatIdsSet.has(session.id) || session.isArchived) {
        return session;
      }

      didChange = true;
      return {
        ...session,
        chatGroupIds: syncArchiveGroup(
          normalizeChatGroupIds(session.chatGroupIds),
          true,
        ),
        isArchived: true,
        updatedAt: now,
      };
    });

    if (!didChange) {
      return;
    }

    await this.storage.writeSessions(nextSessions);
    emitChatHistoryUpdated();
  }

  async deleteChats(chatIds: string[]): Promise<void> {
    if (chatIds.length === 0) {
      return;
    }

    const chatIdsSet = new Set(chatIds);
    const sessions = await this.storage.readSessions();
    const nextSessions = sessions.filter((session) => !chatIdsSet.has(session.id));

    if (nextSessions.length === sessions.length) {
      return;
    }

    await this.storage.writeSessions(nextSessions);
    emitChatHistoryUpdated();
  }

  async clearChats(): Promise<void> {
    await this.storage.writeSessions([]);
    emitChatHistoryUpdated();
  }
}

export const chatStore = new BrowserChatStore();
