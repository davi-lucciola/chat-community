import type { FastifyReply, FastifyRequest } from 'fastify';

export type ParamRequest<P> = FastifyRequest<{ Params: P }>;
export type Request<B = undefined, P = undefined> = FastifyRequest<{
  Body: B;
  Params: P;
}>;

export type Reply = FastifyReply;
