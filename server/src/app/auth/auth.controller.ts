import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema, tokenSchema, type LoginDTO } from './auth.schema';
import { AuthService } from './auth.service';
import { messageSchema } from '@/lib/schemas';

const authController = {
  login: async (app: FastifyInstance) => {
    type Request = FastifyRequest<{ Body: LoginDTO }>;
    type Reply = FastifyReply;

    const options = {
      schema: {
        tags: ['Auth'],
        body: loginSchema,
        response: {
          200: tokenSchema,
          401: messageSchema,
        },
      },
    };

    app.post('/login', options, async (request: Request, _: Reply) => {
      const authService = new AuthService(app.jwt);
      const tokenResponse = await authService.login(request.body);
      return tokenResponse;
    });
  },
};

export default authController;
