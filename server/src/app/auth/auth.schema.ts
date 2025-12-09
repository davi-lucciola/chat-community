import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({
    error: 'Invalid "email" format, please ensure it contains an "@" symbol',
  }),
  password: z
    .string({ error: 'Password be a string.' })
    .min(4, { error: 'Password must have at least 4 characters.' }),
});

export const tokenSchema = z.object({
  accessToken: z.string(),
  type: z.string(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type TokenDTO = z.infer<typeof tokenSchema>;
