import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mongoose from 'mongoose';
import routes from '@/routes';
import type { Settings } from '@/settings';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export const createApp = async (settings: Settings) => {
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

  // Database
  await mongoose.connect(settings.MONGODB_URL);

  return app;
};
