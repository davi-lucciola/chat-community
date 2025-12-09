import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '@/lib/auth';
import { UserService } from './user.service';
import type { CreateUserDTO, UserDTO } from './user.schema';
import { userSchema, createUserSchema } from './user.schema';
import { messageSchema } from '@/lib/schemas';

const create = async (app: FastifyInstance) => {
  type Request = FastifyRequest<{ Body: CreateUserDTO }>;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Users'],
      body: createUserSchema,
      response: {
        200: userSchema,
        400: messageSchema,
      },
    },
  };

  app.post('/users', options, async (request: Request, _: Response) => {
    const userService = new UserService();
    return await userService.createUser(request.body);
  });
};

const getCurrent = async (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  type Request = FastifyRequest;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Users'],
      response: {
        200: userSchema,
        401: messageSchema,
      },
    },
  };

  app.get('/users/me', options, async (request: Request, _: Response) => {
    return request.user as UserDTO;
  });
};

export default {
  create,
  getCurrent,
};
