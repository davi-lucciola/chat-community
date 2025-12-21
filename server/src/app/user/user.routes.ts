import type { FastifyInstance } from 'fastify';
import userController from './user.controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.register(userController.getCurrentUser);
  app.register(userController.update);
};
