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
      '/users',
      {
        schema: {
          tags: ['Users'],
          description: 'Get the current authenticated user.',
          response: {
            200: UserSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, _: Reply) => {
        const userService = new UserService();
        const { id: userId } = request.user as UserDTO;
        return await userService.findById(userId);
      },
    );
  },
  update: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.put(
      '/users',
      {
        schema: {
          tags: ['Users'],
          description: 'Update your own user.',
          body: SaveUserSchema,
          response: {
            200: UserSchema,
            400: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<SaveUserDTO>, _: Reply) => {
        const userService = new UserService();
        const { id: userId } = request.user as UserDTO;
        return await userService.update(request.body, userId);
      },
    );
  },
};

export default userController;
