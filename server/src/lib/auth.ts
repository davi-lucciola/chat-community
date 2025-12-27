import type { FastifyJWT } from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UserDTO } from '@/app/user/user.schema';
import { UnauthorizedError } from '@/lib/errors';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserDTO;
  }
}

export const TOKEN_KEY = 'accessToken';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.cookies[TOKEN_KEY];

  if (!token) {
    throw new UnauthorizedError('You must be authenticated.');
  }

  try {
    const user = request.jwt.verify<FastifyJWT['user']>(token);
    request.user = user;
  } catch (_) {
    reply.clearCookie(TOKEN_KEY);
    throw new UnauthorizedError('Invalid token.');
  }
};
