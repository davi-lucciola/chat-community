import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import type { Reply, Request } from '@/lib/http';
import { MessageSchema } from '@/lib/schemas';
import type { SaveUserDTO, UserDTO } from './user.schema';
import { SaveUserSchema, UserSchema } from './user.schema';
import { UserService } from './user.service';

const userController = {
  getCurrentUser: async (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

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
    app.addHook('preHandler', authenticate);

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
