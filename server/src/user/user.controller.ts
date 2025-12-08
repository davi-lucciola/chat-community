import { randomUUID } from 'node:crypto';
import {
  userSchema,
  createUserSchema,
  type UserDTO,
  type CreateUserDTO,
} from './user.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';

type CreateUserRequest = FastifyRequest<{ Body: CreateUserDTO }>;

const userController = {
  create: {
    options: {
      schema: {
        body: createUserSchema,
        response: {
          201: userSchema,
        },
      },
    },
    handler: async (request: CreateUserRequest, reply: FastifyReply) => {
      // Mocked user
      const newUser: UserDTO = {
        id: randomUUID(),
        ...request.body,
      };

      reply.code(201).send(newUser);
    },
  },
};

export default userController;
