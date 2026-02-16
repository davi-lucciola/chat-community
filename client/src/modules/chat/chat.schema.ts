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

export const statusChangeSchema = z.object({
  userId: z.string(),
  status: z.enum(['ONLINE', 'OFFLINE', 'IDLE'])
})

export const sendMessageSchema = z.object({
  message: z.string(),
});

export const messageEventSchema = z.object({
  event: z.literal('message'),
  payload: chatMessageSchema,
  error: z.boolean(),
});

export const statusChangeEventSchema = z.object({
  event: z.literal('status_change'),
  payload: statusChangeSchema,
  error: z.literal(false),
});

export const eventSchema = z.discriminatedUnion('event', [
  messageEventSchema,
  statusChangeEventSchema,
]);

export type MessageEventDTO = z.infer<typeof messageEventSchema>;
export type StatusChangeEventDTO = z.infer<typeof statusChangeEventSchema>;
export type EventDTO = z.infer<typeof eventSchema>;
