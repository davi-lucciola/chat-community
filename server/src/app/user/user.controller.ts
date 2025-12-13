import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { UserService } from './user.service';
import type { CreateUserDTO, UpdateUsernameDTO, UserDTO } from './user.schema';
import { UserSchema, CreateUserSchema, UpdateUsernameSchema } from './user.schema';
import { MessageSchema } from '@/lib/schemas';
import type { Request, Reply, ParamRequest } from '@/lib/http';

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
  getCurrentUser: async (app: FastifyInstance) => {
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
  updateName: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.patch(
      '/users/me/:name',
      {
        schema: {
          tags: ['Users'],
          params: UpdateUsernameSchema,
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<UpdateUsernameDTO>, _: Reply) => {
        const userService = new UserService();

        const { name } = request.params;
        const { id: userId } = request.user as UserDTO;

        await userService.updateUsername(name, userId);

        return { message: `Your user name has been updated to ${name}.` };
      },
    );
  },
};

export default userController;
