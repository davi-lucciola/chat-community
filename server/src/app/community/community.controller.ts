import type { FastifyInstance } from 'fastify';
import type { ParamRequest, Request, Reply } from '@/lib/http';
import type { UserDTO } from '@/app/user/user.schema';
import type { CreateCommunityDTO, CommunityIdDTO } from './community.schema';
import {
  CommunitiesSchema,
  CommunitySchema,
  CommunityIdSchema,
  CreateCommunitySchema,
} from './community.schema';
import { authenticate } from '@/lib/auth';
import { MessageSchema } from '@/lib/schemas';
import { CommunityService } from './community.service';

const communityController = {
  getAll: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/communities',
      {
        schema: {
          tags: ['Community'],
          description: 'Get all communities.',
          response: {
            200: CommunitiesSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request, reply: Reply) => {
        const user = request.user as UserDTO;
        const communityService = new CommunityService(user);

        const communities = await communityService.findAll();

        reply.send(communities);
      },
    );
  },
  getById: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.get(
      '/communities/:id',
      {
        schema: {
          tags: ['Community'],
          description: 'Get a community by id.',
          params: CommunityIdSchema,
          response: {
            200: CommunitySchema,
            401: MessageSchema,
            404: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<CommunityIdDTO>, reply: Reply) => {
        const { id: communityId } = request.params;

        const user = request.user as UserDTO;
        const communityService = new CommunityService(user);

        const community = await communityService.findById(communityId);

        reply.send(community);
      },
    );
  },
  create: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.post(
      '/communities',
      {
        schema: {
          tags: ['Community'],
          description: 'Create your own community.',
          body: CreateCommunitySchema,
          response: {
            200: CommunitySchema,
            400: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: Request<CreateCommunityDTO>, reply: Reply) => {
        const currentUser = request.user as UserDTO;
        const communityService = new CommunityService(currentUser);

        const community = await communityService.create(request.body);

        reply.send(community);
      },
    );
  },
  becomeMember: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.put(
      '/communities/:id/member',
      {
        schema: {
          tags: ['Community'],
          description: 'Become a member of a community.',
          params: CommunityIdSchema,
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<CommunityIdDTO>, reply: Reply) => {
        const { id: communityId } = request.params;

        const currentUser = request.user as UserDTO;
        const communityService = new CommunityService(currentUser);

        const community = await communityService.becomeMember(communityId);

        reply.send({ message: `Welcome to ${community.title} ${currentUser.name}!` });
      },
    );
  },
  stopBeingMember: async (app: FastifyInstance) => {
    app.addHook('onRequest', authenticate);

    app.delete(
      '/communities/:id/member',
      {
        schema: {
          tags: ['Community'],
          description: 'Leave a community as member.',
          params: CommunityIdSchema,
          response: {
            200: MessageSchema,
            401: MessageSchema,
          },
        },
      },
      async (request: ParamRequest<CommunityIdDTO>, reply: Reply) => {
        const { id: communityId } = request.params;
        const currentUser = request.user as UserDTO;
        const communityService = new CommunityService(currentUser);

        await communityService.stopBeingMember(communityId);

        reply.send({ message: `It is sad, but you are welcome to come back!` });
      },
    );
  },
};

export default communityController;
