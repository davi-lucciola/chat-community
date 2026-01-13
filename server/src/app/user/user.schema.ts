import { z } from 'zod';
import { UserStatus } from './enums/user-status';

// Status
export const UserStatusSchema = z.enum([
  UserStatus.ONLINE,
  UserStatus.OFFLINE,
  UserStatus.IDLE,
]);

export const UserStatusUpdateSchema = z.object({
  type: z.literal('status_update'),
  status: UserStatusSchema,
});

export type UserStatusUpdateDTO = z.infer<typeof UserStatusUpdateSchema>;

// Get
export const UserBasicSchema = z.object({
  _id: z.coerce.string(),
  name: z.string(),
  imageUrl: z.string().nullish(),
});

export const UserSchema = z.object({
  _id: z.coerce.string(),
  name: z.string(),
  email: z.email(),
  imageUrl: z.string().nullable().default(null),
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
