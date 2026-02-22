import {
  chatListStore,
  type ChatList,
  type ChatListStore,
} from "../stores/chat-list-store";

export {
  CHAT_LISTS_UPDATED_EVENT,
  ARCHIVED_CHAT_LIST_ID,
  FAVORITES_CHAT_LIST_ID,
  type ChatList,
} from "../stores/chat-list-store";

export class ChatListService {
  constructor(private readonly store: ChatListStore = chatListStore) {}

  async listChatLists(): Promise<ChatList[]> {
    return this.store.readLists();
  }

  async createChatList(input: {
    title: string;
    description?: string;
    color?: string;
  }): Promise<ChatList> {
    return this.store.createList(input);
  }
}

export const chatListService = new ChatListService();
