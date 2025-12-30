import type { FastifyInstance } from 'fastify';
import { authRoutes } from '@/app/auth/auth.routes';
import { communityRoutes } from '@/app/community/community.routes';
import { userRoutes } from '@/app/user/user.routes';
import { chatRoutes } from './app/chat/chat.routes';

const initRoutes = async (app: FastifyInstance) => {
  app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok' });
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(chatRoutes);
  await app.register(communityRoutes);
};

export default { initRoutes };
