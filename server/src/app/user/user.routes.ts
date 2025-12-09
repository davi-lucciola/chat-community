import type { FastifyInstance } from 'fastify';
import userController from './user.controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', userController.create.options, userController.create.handler);
};
