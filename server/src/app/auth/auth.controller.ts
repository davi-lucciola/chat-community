import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema, tokenSchema, type LoginDTO } from './auth.schema';
import { AuthService } from './auth.service';
import { domainErrorSchema } from '@/lib/errors';

export const authController = (app: FastifyInstance) => {
  type LoginRequest = FastifyRequest<{ Body: LoginDTO }>;

  const login = {
    options: {
      schema: {
        tags: ['Auth'],
        body: loginSchema,
        response: {
          200: tokenSchema,
          401: domainErrorSchema,
        },
      },
    },
    handler: async (request: LoginRequest, _: FastifyReply) => {
      const authService = new AuthService(app.jwt);
      const tokenResponse = await authService.login(request.body);
      return tokenResponse;
    },
  };

  return { login };
};
