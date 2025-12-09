import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '@/lib/auth';
import type { CreateChatDTO, ChatIdDTO } from './chat.schema';
import { chatsSchema, chatSchema, chatIdSchema, createChatSchema } from './chat.schema';
import { ChatService } from './chat.service';
import type { UserDTO } from '../user/user.schema';
import { messageSchema } from '@/lib/schemas';

const getAll = (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  const options = {
    schema: {
      tags: ['Chat'],
      response: {
        200: chatsSchema,
        401: messageSchema,
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
        401: messageSchema,
        404: messageSchema,
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
        400: messageSchema,
        401: messageSchema,
      },
    },
  };

  app.post('/chats', options, async (request: Request, _: Response) => {
    const currentUser = request.user as UserDTO;
    const chatService = new ChatService(currentUser);
    return await chatService.create(request.body);
  });
};

const becomeMember = async (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  type Request = FastifyRequest<{ Params: ChatIdDTO }>;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Chat'],
      params: chatIdSchema,
      response: {
        200: messageSchema,
        401: messageSchema,
      },
    },
  };

  app.put('/chats/:id/member', options, async (request: Request, _: Response) => {
    const { id: chatId } = request.params;
    const currentUser = request.user as UserDTO;

    const chatService = new ChatService(currentUser);
    const chat = await chatService.becomeMember(chatId);
    return { message: `Welcome to ${chat.title} ${currentUser.name}!` };
  });
};

const stopBeingMember = async (app: FastifyInstance) => {
  app.addHook('onRequest', authenticate);

  type Request = FastifyRequest<{ Params: ChatIdDTO }>;
  type Response = FastifyReply;

  const options = {
    schema: {
      tags: ['Chat'],
      params: chatIdSchema,
      response: {
        200: messageSchema,
        401: messageSchema,
      },
    },
  };

  app.delete('/chats/:id/member', options, async (request: Request, _: Response) => {
    const { id: chatId } = request.params;
    const currentUser = request.user as UserDTO;

    const chatService = new ChatService(currentUser);
    await chatService.stopBeingMember(chatId);
    return { message: `It is sad, but you are welcome to come back!` };
  });
};

export default {
  getAll,
  getById,
  create,
  becomeMember,
  stopBeingMember,
};
