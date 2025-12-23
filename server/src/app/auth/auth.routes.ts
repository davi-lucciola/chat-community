import type { FastifyInstance } from 'fastify';
import authController from './auth.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(authController.signIn);
  app.register(authController.signUp);
  app.register(authController.signOut);
};
