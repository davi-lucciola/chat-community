import path from 'node:path';
import AutoLoad from '@fastify/autoload';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import mongoose from 'mongoose';
import { errorHandler } from '@/lib/errors';
import routes from '@/routes';
import { settings } from '@/settings';

export const createApp = async () => {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler);

  // Plugins
  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  });

  // Database
  await mongoose.connect(settings.MONGODB_URL);

  // Routes
  await app.register(routes.initRoutes, { prefix: '/api/' });

  return app;
};

const main = async () => {
  const app = await createApp();
  await app.listen({ port: 3333, host: '0.0.0.0' });
};

main()
  .then(() => {
    console.log('🔥 Server is running at http://localhost:3333');
    console.log('You can access the documentation at http://localhost:3333/api/docs');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
