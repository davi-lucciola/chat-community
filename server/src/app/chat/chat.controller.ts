import type { FastifyInstance } from 'fastify';
import type ws from 'ws';
import { authenticate } from '@/lib/auth';
import type { QueryRequest } from '@/lib/http';
import { type ChatConnectionQueryDTO, chatConnectionQuerySchema } from './chat.schema';

type WsClients = Map<string, ws.WebSocket>;
export const chatWsClients: Map<string, WsClients> = new Map();

const chatController = {
  chatConnection: (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get(
      '/chat',
      {
        schema: {
          tags: ['Chat'],
          querystring: chatConnectionQuerySchema,
          description: 'Connect with a chat',
        },
        websocket: true,
      },
      (socket, request: QueryRequest<ChatConnectionQueryDTO>) => {
        const user = request.user;
        const { communityId } = request.query;

        const communityWsClients: WsClients =
          chatWsClients.get(communityId) ?? new Map();

        if (!chatWsClients.has(communityId)) {
          chatWsClients.set(communityId, communityWsClients);
        }

        if (!communityWsClients.has(user._id)) {
          communityWsClients.set(user._id, socket);
        }

        socket.on('message', (message) => {
          const data = JSON.parse(message.toString());

          const connectedWsClients = communityWsClients
            .values()
            .map((conn) => {
              if (conn.readyState !== conn.OPEN) {
                communityWsClients.delete(user._id);
                return null;
              }

              return conn;
            })
            .filter((conn) => conn !== null);

          connectedWsClients.forEach((conn) => {
            conn.send(
              JSON.stringify({
                message: data.message,
                username: user.name,
              }),
            );
          });
        });

        socket.on('close', () => {
          communityWsClients.delete(user._id);
        });
      },
    );
  },
};

export default chatController;
