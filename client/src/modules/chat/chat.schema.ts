import { z } from 'zod';
import type { UserBasicDTO } from '../user/user.schema';

export type ChatMessageDTO = {
  _id: string;
  message: string;
  user: UserBasicDTO;
  createdAt: string;
};

export const chatMessageSchema = z.object({
  _id: z.string(),
  message: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
  }),
  communityId: z.string(),
  createdAt: z.string(),
});

export const sendMessageSchema = z.object({
  message: z.string(),
});

export const messageEventSchema = z.object({
  event: z.enum(['message']),
  payload: chatMessageSchema,
  error: z.boolean(),
});

export type MessageEventDTO = z.infer<typeof messageEventSchema>;
