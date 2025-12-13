import { z } from 'zod';

// Get
export const UserBasicSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullish(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  imageUrl: z.string().nullable(),
});

export type UserDTO = z.infer<typeof UserSchema>;

// Create
export const SaveUserSchema = z.object({
  name: z.string({ error: 'Invalid "name". Must be a string.' }),
  email: z.email({
    error: 'Invalid "email" format. Please ensure it contains an "@" symbol',
  }),
  password: z
    .string({ error: 'Password be a string.' })
    .min(4, { error: 'Password must have at least 4 characters.' }),
});

export type SaveUserDTO = z.infer<typeof SaveUserSchema>;
