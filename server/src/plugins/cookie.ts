import fp from 'fastify-plugin';
import { settings } from '@/settings';

const cookiePlugin = fp((app, _, done) => {
  app.register(import('@fastify/cookie'), {
    secret: settings.JWT_SECRET,
    hook: 'preHandler',
  });

  done();
});

export default cookiePlugin;
