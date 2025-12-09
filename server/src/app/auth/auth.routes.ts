import type { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';

export const authRoutes = async (app: FastifyInstance) => {
  const { login } = authController(app);

  app.post('/login', login.options, login.handler);
};
