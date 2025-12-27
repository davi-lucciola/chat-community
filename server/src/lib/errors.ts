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
  } else if (error instanceof UnauthorizedError) {
    reply.code(401).send({ message: error.message });
  } else if (error instanceof DomainError) {
    reply.code(400).send({ message: error.message });
  } else {
    // biome-ignore lint/suspicious/noExplicitAny: zod validation error
    const errorAny = error as any;
    console.error(errorAny);
    reply.code(500).send({
      message:
        errorAny.code === 'FST_ERR_VALIDATION'
          ? errorAny.validation[0].message
          : 'Sorry, a unexpected error occurred.',
    });
  }
};
