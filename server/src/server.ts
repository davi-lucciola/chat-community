import Fastify from 'fastify';
import * as routes from '@/routes';
import fastifyCors from '@fastify/cors';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export const createApp = async () => {
  const app = Fastify().withTypeProvider<TypeBoxTypeProvider>();

  // Cors
  await app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Docs
  await routes.initSwaggerDocs(app);

  // Routes
  await routes.initRoutes(app);

  return app;
};

const main = async () => {
  try {
    const app = await createApp();
    await app.listen({ port: 3333, host: '0.0.0.0' });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

main().then(() => {
  console.log(
    '🔥 Server is running at http://localhost:3333\n' +
      'You can access the documentation at http://localhost:3333/docs',
  );
});
