import mongoose from 'mongoose';
import type ws from 'ws';
import { CommunityMember } from '../community/community.model';
import {
  type UserStatus,
  UserStatus as UserStatusConst,
} from '../user/enums/user-status';
import type { UserDocument } from '../user/user.model';
import { chatConnectionManager } from './chat.websocket';

type UserStatusEntry = {
  status: UserStatus;
  socket: ws.WebSocket;
};

class UserStatusManager {
  private users: Map<string, UserStatusEntry> = new Map();

  connect(userId: string, socket: ws.WebSocket): void {
    this.users.set(userId, {
      status: UserStatusConst.ONLINE,
      socket,
    });

    this.broadcastToChats(userId, UserStatusConst.ONLINE);
  }

  disconnect(userId: string) {
    const entry = this.users.get(userId);
    if (!entry) return;

    this.users.delete(userId);
    this.broadcastToChats(userId, UserStatusConst.OFFLINE);
  }

  getStatus(userId: string): UserStatus {
    return this.users.get(userId)?.status ?? UserStatusConst.OFFLINE;
  }

  async setStatus(user: UserDocument, status: UserStatus) {
    const entry = this.users.get(user._id.toString());

    user.status = status;
    await user.save();

    if (!entry) return;
    if (entry.status === status) return;

    entry.status = status;
    this.broadcastToChats(user._id.toString(), status);
  }

  private async broadcastToChats(userId: string, status: UserStatus): Promise<void> {
    const memberships = await CommunityMember.find({
      'user._id': new mongoose.Types.ObjectId(userId),
      communityId: new mongoose.Types.ObjectId('694e40f234be40594400cf2d'),
    });

    const event = {
      event: 'status_change',
      payload: { userId, status },
      error: false,
    };

    memberships.forEach((membership) => {
      const communityId = membership.communityId.toString();
      const connections = chatConnectionManager.getChatConnections(communityId);

      for (const [, socket] of connections) {
        if (socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify(event));
        }
      }
    });
  }
}

export const userStatusManager = new UserStatusManager();
