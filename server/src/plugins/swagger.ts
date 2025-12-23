import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

const swaggerPlugin = fp((app, _, done) => {
  app.register(import('@fastify/swagger'), {
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

  app.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
  });

  done();
});

export default swaggerPlugin;
