import mongoose from 'mongoose';
import type { CommunityDocument } from '../community/community.model';
import type { UserDTO } from '../user/user.schema';
import type { ChatConnections } from '../websockets/chat.websocket';
import { ChatMessage } from './chat.model';
import { ChatEventSchema, type ChatMessageDTO } from './chat.schema';

export class ChatService {
  constructor(
    private readonly currentUser: UserDTO,
    private readonly community: CommunityDocument,
    private readonly chatConnections: ChatConnections,
  ) {}

  async getMessages() {
    return ChatMessage.aggregate<ChatMessageDTO>([
      {
        $match: {
          communityId: this.community._id,
        },
      },
      {
        $addFields: {
          createdAt: { $toDate: '$_id' },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 100,
      },
    ]);
  }

  async sendMessage(message: string) {
    const chatMessage = await ChatMessage.create({
      message: message,
      user: {
        _id: new mongoose.Types.ObjectId(this.currentUser._id),
        name: this.currentUser.name,
        imageUrl: this.currentUser.imageUrl,
      },
      communityId: this.community._id,
    });

    const connectedUsers = this.chatConnections
      .entries()
      .filter(([userId, connection]) => {
        if (connection.readyState !== connection.OPEN) {
          this.chatConnections.delete(userId);
          return false;
        }

        return true;
      })
      .map(([_, connection]) => connection);

    const chatMessageEvent = ChatEventSchema.parse({
      error: false,
      payload: {
        _id: chatMessage._id,
        message: chatMessage.message,
        user: chatMessage.user,
        communityId: chatMessage.communityId,
        createdAt: chatMessage._id.getTimestamp(),
      },
      event: 'message',
    });

    connectedUsers.forEach((connection) => {
      connection.send(JSON.stringify(chatMessageEvent));
    });
  }
}
