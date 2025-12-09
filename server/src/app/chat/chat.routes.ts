import type { FastifyInstance } from 'fastify';
import chatController from './chat.controller';

export const chatRoutes = async (app: FastifyInstance) => {
  app.register(chatController.getAll);
  app.register(chatController.getById);
  app.register(chatController.create);
};
