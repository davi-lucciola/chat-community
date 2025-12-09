import { z } from 'zod';

export const domainErrorSchema = z.object({
  message: z.string(),
});

export class DomainError extends Error {}
export class NotFoundError extends DomainError {}
export class UnauthorizedError extends DomainError {}
