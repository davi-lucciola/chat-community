import type { FastifyInstance } from 'fastify';
import { userController } from './user.controller';

export const userRoutes = async (app: FastifyInstance) => {
  const { createUser, getCurrentUser } = userController(app);

  app.post('/users', createUser.options, createUser.handler);
  app.get('/users/me', getCurrentUser.options, getCurrentUser.handler);
};
