import Fastify from 'fastify';
import * as routes from '@/routes';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';

const app = Fastify().withTypeProvider<TypeBoxTypeProvider>();

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Personal Budget Control',
      description: 'API for personal budget control',
      version: '1.0.0',
    },
  },
});

app.register(ScalarApiReference, {
  routePrefix: '/docs',
});

routes.initRoutes(app);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(
    '🔥 Server is running at http://localhost:3333\n' +
      'You can access the documentation at http://localhost:3333/docs',
  );
});
