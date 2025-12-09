import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '@/lib/auth';
import { domainErrorSchema } from '@/lib/errors';
import type { CreateChatDTO, ChatIdDTO } from './chat.schema';
import { chatsSchema, chatSchema, chatIdSchema, createChatSchema } from './chat.schema';
import { ChatService } from './chat.service';
import type { UserDTO } from '../user/user.schema';

const getAll = (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  const options = {
    schema: {
      tags: ['Chat'],
      response: {
        200: chatsSchema,
        401: domainErrorSchema,
      },
    },
  };

  app.get('/chats', options, async (request: FastifyRequest, _: FastifyReply) => {
    const user = request.user as UserDTO;
    const chatService = new ChatService(user);

    return await chatService.findAll();
  });
};

const getById = (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  type Request = FastifyRequest<{ Params: ChatIdDTO }>;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Chat'],
      params: chatIdSchema,
      response: {
        200: chatSchema,
        401: domainErrorSchema,
        404: domainErrorSchema,
      },
    },
  };

  app.get('/chats/:id', options, async (request: Request, _: Response) => {
    const { id: chatId } = request.params;

    const user = request.user as UserDTO;
    const chatService = new ChatService(user);

    return await chatService.findById(chatId);
  });
};

const create = async (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  type Request = FastifyRequest<{ Body: CreateChatDTO }>;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Chat'],
      body: createChatSchema,
      response: {
        200: chatSchema,
        400: domainErrorSchema,
        401: domainErrorSchema,
      },
    },
  };

  app.post('/chats', options, async (request: Request, _: Response) => {
    const currentUser = request.user as UserDTO;
    const chatService = new ChatService(currentUser);
    return await chatService.create(request.body);
  });
};

export default {
  getAll,
  getById,
  create,
};
