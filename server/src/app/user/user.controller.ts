import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { UserService } from './user.service';
import type { CreateUserDTO, UserDTO } from './user.schema';
import { UserSchema, CreateUserSchema } from './user.schema';
import { MessageSchema } from '@/lib/schemas';
import type { Request, Reply } from '@/lib/http';

const userController = {
  create: async (app: FastifyInstance) => {
    app.post(
      '/users',
      {
        schema: {
          tags: ['Users'],
          body: CreateUserSchema,
          response: {
            200: UserSchema,
            400: MessageSchema,
          },
        },
      },
      async (request: Request<CreateUserDTO>, _: Reply) => {
        const userService = new UserService();
        return await userService.createUser(request.body);
      },
    );
  },
  getCurrent: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/users/me',
      {
        schema: {
          tags: ['Users'],
          response: {
            200: UserSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, _: Reply) => {
        return request.user as UserDTO;
      },
    );
  },
};

export default userController;
