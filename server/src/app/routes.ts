import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

import { userRoutes } from './user/user.routes';
import { authRoutes } from './auth/auth.routes';
import { communityRoutes } from './community/community.routes';

const initRoutes = async (app: FastifyInstance) => {
  app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok' });
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(communityRoutes);
};

const initSwaggerDocs = async (app: FastifyInstance) => {
  // Swagger
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Chat Community API',
        description: 'API for basic chat social media',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          httpBearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ httpBearer: [] }],
    },
    transform: jsonSchemaTransform,
  });

  const ScalarApiReference = import('@scalar/fastify-api-reference')
  
  await app.register(ScalarApiReference, {
    routePrefix: '/docs',
  });
};

export default {
  initRoutes,
  initSwaggerDocs,
};
