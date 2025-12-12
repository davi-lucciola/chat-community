import type { FastifyInstance } from 'fastify';
import { LoginSchema, TokenSchema, type LoginDTO } from './auth.schema';
import { AuthService } from './auth.service';
import { MessageSchema } from '@/lib/schemas';
import type { Request, Reply } from '@/lib/http';

const authController = {
  login: async (app: FastifyInstance) => {
    app.post(
      '/login',
      {
        schema: {
          tags: ['Auth'],
          body: LoginSchema,
          response: {
            200: TokenSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<LoginDTO>, _: Reply) => {
        const authService = new AuthService(app.jwt);
        const tokenResponse = await authService.login(request.body);
        return tokenResponse;
      },
    );
  },
};

export default authController;
