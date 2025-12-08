import type { FastifyInstance } from 'fastify';
import { userRoutes } from './user/user.routes';

export const initRoutes = (app: FastifyInstance) => {
  app.after(() => {
    app.get('/health', async (_, reply) => {
      reply.send({ status: 'ok' });
    });

    app.register(userRoutes);
  });
};
