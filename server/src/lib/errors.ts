import type { FastifyReply, FastifyRequest } from 'fastify';

export class DomainError extends Error {}
export class NotFoundError extends DomainError {}
export class UnauthorizedError extends DomainError {}

export const errorHandler = (
  error: unknown,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof NotFoundError) {
    reply.code(404).send({ message: error.message });
    return;
  } else if (error instanceof UnauthorizedError) {
    reply.code(401).send({ message: error.message });
    return;
  } else if (error instanceof DomainError) {
    reply.code(400).send({ message: error.message });
    return;
  }

  // biome-ignore lint/suspicious/noExplicitAny: zod validation error
  const errorAny = error as any;
  const isZodError = errorAny.code === 'FST_ERR_VALIDATION';

  if (isZodError) {
    reply.code(400).send({
      message: errorAny.validation[0].message,
    });
    return;
  }

  console.error(errorAny);

  reply.code(500).send({
    message: 'Sorry, a unexpected error occurred.',
  });
};
