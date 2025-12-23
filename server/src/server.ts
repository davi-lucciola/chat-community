import path from 'node:path';
import Fastify from 'fastify';
import mongoose from 'mongoose';
import AutoLoad from '@fastify/autoload';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import routes from '@/routes';
import { settings } from '@/settings';
import { errorHandler } from '@/lib/errors';

export const createApp = async () => {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Plugins
  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  });

  // Routes
  await routes.initRoutes(app);

  app.setErrorHandler(errorHandler);

  // Database
  await mongoose.connect(settings.MONGODB_URL);

  return app;
};

const main = async () => {
  const app = await createApp();
  await app.listen({ port: 3333, host: '0.0.0.0' });
};

main()
  .then(() => {
    console.log('🔥 Server is running at http://localhost:3333');
    console.log('You can access the documentation at http://localhost:3333/docs');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
