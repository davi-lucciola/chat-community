import { z } from 'zod';

export const basicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullish(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  imageUrl: z.string().nullish(),
});

export const createUserSchema = z.object({
  name: z.string({ error: 'Invalid "name". Must be a string.' }),
  email: z.email({
    error: 'Invalid "email" format. Please ensure it contains an "@" symbol',
  }),
  password: z
    .string({ error: 'Password be a string.' })
    .min(4, { error: 'Password must have at least 4 characters.' }),
});

export type UserDTO = z.infer<typeof userSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
