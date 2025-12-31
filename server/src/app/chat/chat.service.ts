import mongoose from 'mongoose';
import type { CommunityDocument } from '../community/community.model';
import type { UserDTO } from '../user/user.schema';
import { ChatMessage } from './chat.model';
import { type ChatMessageDTO, ChatMessageResponseSchema } from './chat.schema';
import type { ChatConnections } from './chat.ws-manager';

export class ChatService {
  constructor(
    private readonly currentUser: UserDTO,
    private readonly community: CommunityDocument,
    private readonly chatConnections: ChatConnections,
  ) {}

  async getMessages() {
    const pipeline: mongoose.PipelineStage[] = [
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
    ];

    return ChatMessage.aggregate<ChatMessageDTO>(pipeline);
  }

  async sendMessage(message: string) {
    await ChatMessage.create({
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

    connectedUsers.forEach((connection) => {
      const chatMessageResponse = ChatMessageResponseSchema.parse({
        error: false,
        message: message,
        user: this.currentUser,
      });
      connection.send(JSON.stringify(chatMessageResponse));
    });
  }
}
