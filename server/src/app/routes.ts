import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

import { userRoutes } from './user/user.routes';
import { authRoutes } from './auth/auth.routes';
import { chatRoutes } from './chat/chat.routes';

const initRoutes = async (app: FastifyInstance) => {
  app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok' });
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(chatRoutes);
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

  await app.register(ScalarApiReference, {
    routePrefix: '/docs',
  });
};

export default {
  initRoutes,
  initSwaggerDocs,
};
