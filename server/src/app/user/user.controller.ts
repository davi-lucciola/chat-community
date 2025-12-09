import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { domainErrorSchema } from '@/lib/errors';
import { authPreHandler } from '@/lib/auth';
import { UserService } from './user.service';
import type { CreateUserDTO } from './user.schema';
import { userSchema, createUserSchema } from './user.schema';

export const userController = (app: FastifyInstance) => {
  type CreateUserRequest = FastifyRequest<{ Body: CreateUserDTO }>;

  const createUser = {
    options: {
      schema: {
        tags: ['Users'],
        body: createUserSchema,
        response: {
          200: userSchema,
          400: domainErrorSchema,
        },
      },
    },
    handler: async (request: CreateUserRequest, _: FastifyReply) => {
      const userService = new UserService();
      return await userService.createUser(request.body);
    },
  };

  const getCurrentUser = {
    options: {
      schema: {
        tags: ['Users'],
        response: {
          200: userSchema,
          401: domainErrorSchema,
        },
      },
      preHandler: authPreHandler,
    },
    handler: async (request: FastifyRequest, _: FastifyReply) => {
      return request.user;
    },
  };

  return { createUser, getCurrentUser };
};
