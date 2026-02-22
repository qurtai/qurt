export const CHAT_LISTS_UPDATED_EVENT = "alem:chat-lists-updated";
const STORAGE_KEY = "alem.chat-lists.v1";

export const FAVORITES_CHAT_LIST_ID = "favorites";
export const ARCHIVED_CHAT_LIST_ID = "archived";

export interface ChatList {
  id: string;
  title: string;
  description: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListStorage {
  readLists(): Promise<ChatList[]>;
  writeLists(lists: ChatList[]): Promise<void>;
}

export interface ChatListStore {
  readLists(): Promise<ChatList[]>;
  createList(input: {
    title: string;
    description?: string;
    color?: string;
  }): Promise<ChatList>;
}

const DEFAULT_CHAT_LISTS: ChatList[] = [
  {
    id: FAVORITES_CHAT_LIST_ID,
    title: "Favorites",
    description: "Your important chats in one place.",
    color: "#3E90F0",
    isDefault: true,
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
  {
    id: ARCHIVED_CHAT_LIST_ID,
    title: "Archived",
    description: "Chats you moved out of the main view.",
    color: "#D84C10",
    isDefault: true,
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
];

const DEFAULT_LISTS_BY_ID = new Map(DEFAULT_CHAT_LISTS.map((list) => [list.id, list]));

class LocalStorageChatListStorage implements ChatListStorage {
  async readLists(): Promise<ChatList[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return normalizeLists(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  async writeLists(lists: ChatList[]): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }
}

function createChatListId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeLists(value: unknown): ChatList[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const candidate = item as Partial<ChatList>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.color !== "string" ||
        typeof candidate.createdAt !== "string" ||
        typeof candidate.updatedAt !== "string"
      ) {
        return null;
      }

      const defaultTemplate = DEFAULT_LISTS_BY_ID.get(candidate.id);

      return {
        id: candidate.id,
        title: candidate.title.trim() || defaultTemplate?.title || "Untitled list",
        description:
          typeof candidate.description === "string"
            ? candidate.description.trim()
            : defaultTemplate?.description || "",
        color: candidate.color || defaultTemplate?.color || "#8E55EA",
        isDefault: candidate.isDefault === true || !!defaultTemplate,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      };
    })
    .filter((list): list is ChatList => list !== null);
}

function ensureDefaultLists(lists: ChatList[]): ChatList[] {
  const merged = new Map<string, ChatList>();

  for (const list of lists) {
    merged.set(list.id, list);
  }

  for (const defaultList of DEFAULT_CHAT_LISTS) {
    const existing = merged.get(defaultList.id);
    if (!existing) {
      merged.set(defaultList.id, defaultList);
      continue;
    }

    merged.set(defaultList.id, {
      ...existing,
      title: existing.title || defaultList.title,
      description: existing.description || defaultList.description,
      color: existing.color || defaultList.color,
      isDefault: true,
    });
  }

  return [...merged.values()].sort((a, b) => {
    if (a.id === FAVORITES_CHAT_LIST_ID || b.id === FAVORITES_CHAT_LIST_ID) {
      return a.id === FAVORITES_CHAT_LIST_ID ? -1 : 1;
    }

    if (a.id === ARCHIVED_CHAT_LIST_ID || b.id === ARCHIVED_CHAT_LIST_ID) {
      return a.id === ARCHIVED_CHAT_LIST_ID ? 1 : -1;
    }

    return a.title.localeCompare(b.title);
  });
}

function emitChatListsUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHAT_LISTS_UPDATED_EVENT));
}

export class BrowserChatListStore implements ChatListStore {
  constructor(private readonly storage: ChatListStorage = new LocalStorageChatListStorage()) {}

  async readLists(): Promise<ChatList[]> {
    const lists = await this.storage.readLists();
    const withDefaults = ensureDefaultLists(lists);

    if (withDefaults.length !== lists.length) {
      await this.storage.writeLists(withDefaults);
    }

    return withDefaults;
  }

  async createList(input: {
    title: string;
    description?: string;
    color?: string;
  }): Promise<ChatList> {
    const title = input.title.trim();
    if (!title) {
      throw new Error("List name is required.");
    }

    const now = new Date().toISOString();
    const list: ChatList = {
      id: createChatListId(),
      title,
      description: input.description?.trim() || "",
      color: input.color || "#8E55EA",
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const lists = await this.storage.readLists();
    const withDefaults = ensureDefaultLists(lists);
    await this.storage.writeLists([...withDefaults, list]);
    emitChatListsUpdated();

    return list;
  }
}

export const chatListStore = new BrowserChatListStore();
