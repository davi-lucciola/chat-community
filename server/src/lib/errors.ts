import type { FastifyReply, FastifyRequest } from 'fastify';
import type ws from 'ws';

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

export const websocketErrorHandler = async <T>(
  socket: ws.WebSocket,
  callback: () => Promise<T>,
) => {
  try {
    return await callback();
  } catch (error) {
    const data = { message: '' };

    console.error(error);

    data.message =
      error instanceof DomainError
        ? error.message
        : 'Sorry, a unexpected error occurred.';

    socket.send(JSON.stringify({ event: 'error', payload: data }));
    socket.close();
  }
};
