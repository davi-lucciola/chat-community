import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { websocketErrorHandler } from '@/lib/errors';
import type { QueryRequest } from '@/lib/http';
import type { CommunityDocument } from '../community/community.model';
import { CommunityService } from '../community/community.service';
import {
  type ChatConnectionQueryDTO,
  ChatConnectionQuerySchema,
  ChatMessageSchema,
} from './chat.schema';
import { ChatService } from './chat.service';
import { chatConnectionManager } from './chat.ws-manager';

const chatController = {
  chatConnection: (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get(
      '/chat',
      {
        schema: {
          tags: ['Chat'],
          querystring: ChatConnectionQuerySchema,
          description: 'Connect with a chat',
        },
        websocket: true,
      },
      async (socket, request: QueryRequest<ChatConnectionQueryDTO>) => {
        const user = request.user;

        const communityService = new CommunityService(user);

        const { communityId } = request.query;

        const community = await websocketErrorHandler<CommunityDocument>(socket, () =>
          communityService.findById(communityId),
        );

        if (!community) return;

        const chatConnections = chatConnectionManager.add(
          socket,
          communityId,
          user._id,
        );

        socket.on('message', async (message) => {
          const chatService = new ChatService(user, community, chatConnections);

          await websocketErrorHandler(socket, async () => {
            const data = ChatMessageSchema.parse(JSON.parse(message.toString()));
            await chatService.sendMessage(data.message);
          });
        });

        socket.on('close', () => chatConnectionManager.remove(communityId, user._id));
      },
    );
  },
};

export default chatController;
