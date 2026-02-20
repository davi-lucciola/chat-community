import fp from 'fastify-plugin';
import { settings } from '@/settings';

const corsPlugin = fp((app, _, done) => {
  app.register(import('@fastify/cors'), {
    origin: settings.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  done();
});

export default corsPlugin;
