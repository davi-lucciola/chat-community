import { UnauthorizedError } from '@/lib/errors';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const authPreHandler = async (request: FastifyRequest, _: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (_) {
    throw new UnauthorizedError('You must be authenticated.');
  }
};
