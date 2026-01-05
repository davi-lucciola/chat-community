import type { FastifyInstance } from 'fastify';
import communityController from './community.controller';

export const communityRoutes = async (app: FastifyInstance) => {
  app.register(communityController.getAll);
  app.register(communityController.getById);
  app.register(communityController.create);
  app.register(communityController.getMembers);
  app.register(communityController.becomeMember);
  app.register(communityController.stopBeingMember);
};
