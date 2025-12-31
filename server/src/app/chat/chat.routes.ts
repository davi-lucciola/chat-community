import type { FastifyInstance } from 'fastify';
import chatController from './chat.controller';

export const chatRoutes = (app: FastifyInstance) => {
  app.register(chatController.chatConnection);
  app.register(chatController.getChatMessages);
};
