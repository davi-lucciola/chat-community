import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { UserService } from './user.service';
import type { SaveUserDTO, UserDTO } from './user.schema';
import { UserSchema, SaveUserSchema } from './user.schema';
import { MessageSchema } from '@/lib/schemas';
import type { Request, Reply } from '@/lib/http';

const userController = {
  getCurrentUser: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/user',
      {
        schema: {
          tags: ['User'],
          description: 'Get the current authenticated user.',
          response: {
            200: UserSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, reply: Reply) => {
        const userService = new UserService();
        const { id: userId } = request.user as UserDTO;

        const user = await userService.findById(userId);

        reply.send(user);
      },
    );
  },
  update: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.put(
      '/user',
      {
        schema: {
          tags: ['User'],
          description: 'Update your own user.',
          body: SaveUserSchema,
          response: {
            200: UserSchema,
            400: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<SaveUserDTO>, reply: Reply) => {
        const userService = new UserService();
        const { id: userId } = request.user as UserDTO;

        const user = await userService.update(request.body, userId);

        reply.send(user);
      },
    );
  },
};

export default userController;
