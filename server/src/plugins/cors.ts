import { settings } from '@/settings';
import fp from 'fastify-plugin';

const corsPlugin = fp((app, _, done) => {
  const developmentOrigin = 'http://127.0.0.1:5173';
  const origin = settings.IS_PROD || developmentOrigin;

  app.register(import('@fastify/cors'), {
    origin: origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  done();
});

export default corsPlugin;
