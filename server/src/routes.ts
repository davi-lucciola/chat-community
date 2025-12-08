import type { FastifyInstance } from 'fastify';

export const initRoutes = (app: FastifyInstance) => {
  app.after(() => {
    app.get('/health', async (_, reply) => {
      reply.send({ status: 'ok' })
    })
  });
};
