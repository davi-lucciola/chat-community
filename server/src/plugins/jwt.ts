import fp from 'fastify-plugin';
import { settings } from '@/settings';
import type { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
}

const jwtPlugin = fp((app, _, done) => {
  app.register(import('@fastify/jwt'), {
    secret: settings.JWT_SECRET,
  });

  app.addHook('preHandler', (req, _, next) => {
    // here we are
    req.jwt = app.jwt;
    return next();
  });

  done();
});

export default jwtPlugin;
