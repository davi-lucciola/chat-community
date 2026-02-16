import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/lib/auth';
import { websocketErrorHandler } from '@/lib/errors';
import type { Reply, Request } from '@/lib/http';
import { MessageSchema } from '@/lib/schemas';
import { userStatusManager } from '../websockets/user.websocket';
import type { UserDocument } from './user.model';
import type { SaveUserDTO, UserDTO } from './user.schema';
import { SaveUserSchema, UserSchema, UserStatusUpdateSchema } from './user.schema';
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
        const { _id: userId } = request.user as UserDTO;

        const user = await userService.findById(userId);
        const status = userStatusManager.getStatus(userId);

        reply.send({ ...user.toObject(), status });
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
        const { _id: userId } = request.user as UserDTO;

        const user = await userService.update(request.body, userId);

        reply.send(user);
      },
    );
  },
  userNotificationConnection: (app: FastifyInstance) => {
    app.addHook('preHandler', authenticate);

    app.get(
      '/user/connect',
      {
        schema: {
          tags: ['User'],
          description: 'Connect to receive notifications and send activity status.',
        },
        websocket: true,
      },
      async (socket, request: Request) => {
        const userService = new UserService();
        const { _id: userId } = request.user as UserDTO;

        const user = await websocketErrorHandler<UserDocument>(socket, () =>
          userService.findById(userId),
        );

        if (!user) return;

        userStatusManager.connect(userId, socket);

        socket.on('message', async (message) => {
          await websocketErrorHandler(socket, async () => {
            const data = UserStatusUpdateSchema.parse(JSON.parse(message.toString()));
            userStatusManager.setStatus(userId, data.status);
          });
        });

        socket.on('close', () => {
          userStatusManager.disconnect(userId);
        });
      },
    );
  },
};

export default userController;
