import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({
    error: 'Invalid "email" format, please ensure it contains an "@" symbol',
  }),
  password: z.string({ error: 'Password be a string.' }),
});

export const TokenSchema = z.object({
  accessToken: z.string(),
  type: z.string(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type TokenDTO = z.infer<typeof TokenSchema>;
