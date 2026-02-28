import type ws from 'ws';

type UserId = string;
type CommunityId = string;

export type ChatConnections = Map<UserId, ws.WebSocket>;

class ChatsConnectionManager {
  chats: Map<CommunityId, ChatConnections>;

  constructor() {
    this.chats = new Map();
  }

  add(socket: ws.WebSocket, communityId: string, userId: string) {
    const chatConnections = this.getChatConnections(communityId);

    if (!this.chats.has(communityId)) {
      this.chats.set(communityId, chatConnections);
    }

    if (!chatConnections.has(userId)) {
      chatConnections.set(userId, socket);
    }

    return chatConnections;
  }

  remove(communityId: string, userId: string) {
    const chatConnections = this.chats.get(communityId);
    if (!chatConnections) return;

    chatConnections.delete(userId);

    if (chatConnections.size === 0) {
      this.chats.delete(communityId);
    }
  }

  getChatConnections(communityId: string): ChatConnections {
    return this.chats.get(communityId) ?? new Map();
  }
}

export const chatConnectionManager = new ChatsConnectionManager();
