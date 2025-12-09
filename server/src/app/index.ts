import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import mongoose from 'mongoose';
import routes from '@/app/routes';
import fastifyJwt from 'fastify-jwt';
import type { Settings } from '@/settings';
import { DomainError, NotFoundError, UnauthorizedError } from '@/lib/errors';

export const createApp = async (settings: Settings) => {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  // Cors
  await app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Docs
  await routes.initSwaggerDocs(app);

  // Routes
  await routes.initRoutes(app);

  // Auth
  await app.register(fastifyJwt, {
    secret: settings.JWT_SECRET,
  });

  // Database
  await mongoose.connect(settings.MONGODB_URL);

  return app;
};

const errorHandler = (error: unknown, _: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof NotFoundError) {
    reply.code(404).send({ message: error.message });
  } else if (error instanceof UnauthorizedError) {
    reply.code(401).send({ message: error.message });
  } else if (error instanceof DomainError) {
    reply.code(400).send({ message: error.message });
  } else {
    console.error(error);
    reply.code(500).send({ message: 'Sorry, a unexpected error occurred.' });
  }
};
