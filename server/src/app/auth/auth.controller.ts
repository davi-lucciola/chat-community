import type { FastifyInstance } from 'fastify';
import { LoginSchema, TokenSchema, type LoginDTO } from './auth.schema';
import type { SaveUserDTO } from '../user/user.schema';
import { UserSchema, SaveUserSchema } from '../user/user.schema';
import { AuthService } from './auth.service';
import { MessageSchema } from '@/lib/schemas';
import type { Request, Reply } from '@/lib/http';
import { UserService } from '../user/user.service';
import { TOKEN_KEY } from '@/lib/auth';

const authController = {
  signIn: async (app: FastifyInstance) => {
    app.post(
      '/sign-in',
      {
        schema: {
          tags: ['Auth'],
          description: 'Create a JWT Token for your user.',
          body: LoginSchema,
          response: {
            200: TokenSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<LoginDTO>, reply: Reply) => {
        const authService = new AuthService(app.jwt);
        const tokenPayload = await authService.login(request.body);

        reply.send(tokenPayload);
      },
    );
  },
  signUp: async (app: FastifyInstance) => {
    app.post(
      '/sign-up',
      {
        schema: {
          tags: ['Auth'],
          description: 'Create a new user.',
          body: SaveUserSchema,
          response: {
            200: UserSchema,
            400: MessageSchema,
          },
        },
      },
      async (request: Request<SaveUserDTO>, reply: Reply) => {
        const userService = new UserService();
        const user = await userService.create(request.body);

        reply.send(user);
      },
    );
  },
};

export default authController;
