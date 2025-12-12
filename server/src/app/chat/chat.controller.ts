import type { FastifyInstance } from 'fastify';
import type { ParamRequest, Request, Reply } from '@/lib/http';
import type { UserDTO } from '@/app/user/user.schema';
import type { CreateChatDTO, ChatIdDTO } from './chat.schema';
import { authenticate } from '@/lib/auth';
import { MessageSchema } from '@/lib/schemas';
import { ChatService } from './chat.service';
import { ChatsSchema, ChatSchema, ChatIdSchema, CreateChatSchema } from './chat.schema';

const chatController = {
  getAll: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/chats',
      {
        schema: {
          tags: ['Chat'],
          response: {
            200: ChatsSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, _: Reply) => {
        const user = request.user as UserDTO;
        const chatService = new ChatService(user);

        return await chatService.findAll();
      },
    );
  },
  getById: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/chats/:id',
      {
        schema: {
          tags: ['Chat'],
          params: ChatIdSchema,
          response: {
            200: ChatSchema,
            401: MessageSchema,
            404: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<ChatIdDTO>, _: Reply) => {
        const { id: chatId } = request.params;

        const user = request.user as UserDTO;
        const chatService = new ChatService(user);

        return await chatService.findById(chatId);
      },
    );
  },
  create: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.post(
      '/chats',
      {
        schema: {
          tags: ['Chat'],
          body: CreateChatSchema,
          response: {
            200: ChatSchema,
            400: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<CreateChatDTO>, _: Reply) => {
        const currentUser = request.user as UserDTO;
        const chatService = new ChatService(currentUser);
        return await chatService.create(request.body);
      },
    );
  },
  becomeMember: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.put(
      '/chats/:id/member',
      {
        schema: {
          tags: ['Chat'],
          params: ChatIdSchema,
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<ChatIdDTO>, _: Reply) => {
        const { id: chatId } = request.params;
        const currentUser = request.user as UserDTO;

        const chatService = new ChatService(currentUser);
        const chat = await chatService.becomeMember(chatId);
        return { message: `Welcome to ${chat.title} ${currentUser.name}!` };
      },
    );
  },
  stopBeingMember: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.delete(
      '/chats/:id/member',
      {
        schema: {
          tags: ['Chat'],
          params: ChatIdSchema,
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<ChatIdDTO>, _: Reply) => {
        const { id: chatId } = request.params;
        const currentUser = request.user as UserDTO;

        const chatService = new ChatService(currentUser);
        await chatService.stopBeingMember(chatId);
        return { message: `It is sad, but you are welcome to come back!` };
      },
    );
  },
};

export default chatController;
