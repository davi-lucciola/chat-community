import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserDTO } from './user.schema';
import userService from './user.service';
import { userSchema, createUserSchema } from './user.schema';

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
      const newUser = await userService.createUser(request.body);
      reply.code(201).send(newUser);
    },
  },
};

export default userController;
