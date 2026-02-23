export const CHAT_GROUPS_UPDATED_EVENT = "alem:chat-groups-updated";
const STORAGE_KEY = "alem.chat-lists.v1"; // Keep for backward compatibility

export const FAVORITES_CHAT_GROUP_ID = "favorites";
export const ARCHIVED_CHAT_GROUP_ID = "archived";

export interface ChatGroup {
  id: string;
  title: string;
  description: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatGroupStorage {
  readGroups(): Promise<ChatGroup[]>;
  writeGroups(groups: ChatGroup[]): Promise<void>;
}

export interface ChatGroupStore {
  readGroups(): Promise<ChatGroup[]>;
  createGroup(input: {
    title: string;
    description?: string;
    color?: string;
  }): Promise<ChatGroup>;
}

const DEFAULT_CHAT_GROUPS: ChatGroup[] = [
  {
    id: FAVORITES_CHAT_GROUP_ID,
    title: "Favorites",
    description: "Your important chats in one place.",
    color: "#3E90F0",
    isDefault: true,
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
  {
    id: ARCHIVED_CHAT_GROUP_ID,
    title: "Archived",
    description: "Chats you moved out of the main view.",
    color: "#D84C10",
    isDefault: true,
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
];

const DEFAULT_GROUPS_BY_ID = new Map(DEFAULT_CHAT_GROUPS.map((group) => [group.id, group]));

class LocalStorageChatGroupStorage implements ChatGroupStorage {
  async readGroups(): Promise<ChatGroup[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return normalizeGroups(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  async writeGroups(groups: ChatGroup[]): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }
}

function createChatGroupId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeGroups(value: unknown): ChatGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const candidate = item as Partial<ChatGroup>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.color !== "string" ||
        typeof candidate.createdAt !== "string" ||
        typeof candidate.updatedAt !== "string"
      ) {
        return null;
      }

      const defaultTemplate = DEFAULT_GROUPS_BY_ID.get(candidate.id);

      return {
        id: candidate.id,
        title: candidate.title.trim() || defaultTemplate?.title || "Untitled group",
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
    .filter((group): group is ChatGroup => group !== null);
}

function ensureDefaultGroups(groups: ChatGroup[]): ChatGroup[] {
  const merged = new Map<string, ChatGroup>();

  for (const group of groups) {
    merged.set(group.id, group);
  }

  for (const defaultGroup of DEFAULT_CHAT_GROUPS) {
    const existing = merged.get(defaultGroup.id);
    if (!existing) {
      merged.set(defaultGroup.id, defaultGroup);
      continue;
    }

    merged.set(defaultGroup.id, {
      ...existing,
      title: existing.title || defaultGroup.title,
      description: existing.description || defaultGroup.description,
      color: existing.color || defaultGroup.color,
      isDefault: true,
    });
  }

  return [...merged.values()].sort((a, b) => {
    if (a.id === FAVORITES_CHAT_GROUP_ID || b.id === FAVORITES_CHAT_GROUP_ID) {
      return a.id === FAVORITES_CHAT_GROUP_ID ? -1 : 1;
    }

    if (a.id === ARCHIVED_CHAT_GROUP_ID || b.id === ARCHIVED_CHAT_GROUP_ID) {
      return a.id === ARCHIVED_CHAT_GROUP_ID ? 1 : -1;
    }

    return a.title.localeCompare(b.title);
  });
}

function emitChatGroupsUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHAT_GROUPS_UPDATED_EVENT));
}

export class BrowserChatGroupStore implements ChatGroupStore {
  constructor(private readonly storage: ChatGroupStorage = new LocalStorageChatGroupStorage()) {}

  async readGroups(): Promise<ChatGroup[]> {
    const groups = await this.storage.readGroups();
    const withDefaults = ensureDefaultGroups(groups);

    if (withDefaults.length !== groups.length) {
      await this.storage.writeGroups(withDefaults);
    }

    return withDefaults;
  }

  async createGroup(input: {
    title: string;
    description?: string;
    color?: string;
  }): Promise<ChatGroup> {
    const title = input.title.trim();
    if (!title) {
      throw new Error("Group name is required.");
    }

    const now = new Date().toISOString();
    const group: ChatGroup = {
      id: createChatGroupId(),
      title,
      description: input.description?.trim() || "",
      color: input.color || "#8E55EA",
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const groups = await this.storage.readGroups();
    const withDefaults = ensureDefaultGroups(groups);
    await this.storage.writeGroups([...withDefaults, group]);
    emitChatGroupsUpdated();

    return group;
  }
}

export const chatGroupStore = new BrowserChatGroupStore();
