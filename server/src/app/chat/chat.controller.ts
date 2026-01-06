import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { websocketErrorHandler } from '@/lib/errors';
import type { QueryRequest, Reply } from '@/lib/http';
import { MessageSchema } from '@/lib/schemas';
import type { CommunityDocument } from '../community/community.model';
import { CommunityService } from '../community/community.service';
import {
  type ChatConnectionQueryDTO,
  ChatConnectionQuerySchema,
  ChatMessagesSchema,
  SendMessageSchema,
} from './chat.schema';
import { ChatService } from './chat.service';
import { chatConnectionManager } from './chat.ws-manager';

const chatController = {
  getChatMessages: (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get(
      '/chat/messages',
      {
        schema: {
          tags: ['Chat'],
          querystring: ChatConnectionQuerySchema,
          description: 'Get messages from a community',
          response: {
            200: ChatMessagesSchema,
            404: MessageSchema,
          },
        },
      },
      async (request: QueryRequest<ChatConnectionQueryDTO>, reply: Reply) => {
        const user = request.user;
        const { communityId } = request.query;

        const communityService = new CommunityService(user);
        const community = await communityService.findById(communityId);

        const chatConnections = chatConnectionManager.getChatConnections(communityId);
        const chatService = new ChatService(user, community, chatConnections);

        const chatMessages = await chatService.getMessages();
        reply.send(chatMessages);
      },
    );
  },
  chatConnection: (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get(
      '/chat/connect',
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
            const data = SendMessageSchema.parse(JSON.parse(message.toString()));
            await chatService.sendMessage(data.message);
          });
        });

        socket.on('close', () => chatConnectionManager.remove(communityId, user._id));
      },
    );
  },
};

export default chatController;
