import { UnauthorizedError } from '@/lib/errors';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const TOKEN_KEY = 'accessToken';

export const authenticate = async (request: FastifyRequest, _: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (_) {
    throw new UnauthorizedError('You must be authenticated.');
  }
};
