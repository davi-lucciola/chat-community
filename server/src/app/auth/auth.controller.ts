import type { FastifyInstance } from 'fastify';
import { authenticate, TOKEN_KEY } from '@/lib/auth';
import type { Reply, Request } from '@/lib/http';
import { MessageSchema } from '@/lib/schemas';
import { settings } from '@/settings';
import type { SaveUserDTO, UserDTO } from '../user/user.schema';
import { SaveUserSchema, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { type LoginDTO, LoginSchema, TokenSchema } from './auth.schema';
import { AuthService } from './auth.service';

const authController = {
  signIn: async (app: FastifyInstance) => {
    app.post(
      '/sign-in',
      {
        schema: {
          tags: ['Auth'],
          description: 'Create a authenticated session with JWT Token.',
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

        reply.setCookie(TOKEN_KEY, tokenPayload.accessToken, {
          path: '/',
          httpOnly: true,
          secure: settings.IS_PROD,
          sameSite: 'lax',
        });

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
            200: UserSchema.omit({ status: true }),
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
  signOut: async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.delete(
      '/sign-out',
      {
        schema: {
          tags: ['Auth'],
          description: 'Delete a authenticated session.',
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, reply: Reply) => {
        const user = request.user as UserDTO;
        const authService = new AuthService(app.jwt);

        await authService.logout(user._id);

        reply.clearCookie(TOKEN_KEY);
        reply.send({ message: 'Signed out successfully' });
      },
    );
  },
};

export default authController;
