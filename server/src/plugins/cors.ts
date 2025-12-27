import fp from 'fastify-plugin';
import { settings } from '@/settings';

const corsPlugin = fp((app, _, done) => {
  const developmentOrigin = 'http://localhost:5173';
  const origin = settings.IS_PROD || developmentOrigin;

  app.register(import('@fastify/cors'), {
    origin: origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  done();
});

export default corsPlugin;
