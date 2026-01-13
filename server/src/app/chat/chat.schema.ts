import { z } from 'zod';
import { UserBasicSchema, UserStatusSchema } from '../user/user.schema';

export const ChatConnectionQuerySchema = z.object({
  communityId: z.string({ error: 'The community id is required to enter the chat' }),
});

export const SendMessageSchema = z.object({
  message: z.string({ error: 'The message is required' }),
});

export const ChatMessagesSchema = z.array(
  z.object({
    _id: z.coerce.string(),
    message: z.string(),
    user: UserBasicSchema,
    communityId: z.coerce.string(),
    createdAt: z.date().transform((value) => value.toISOString()),
  }),
);

export const ChatMessageSchema = z.object({
  _id: z.coerce.string(),
  message: z.string(),
  user: UserBasicSchema,
  communityId: z.coerce.string(),
  createdAt: z.date().transform((value) => value.toISOString()),
});

export const ChatEventSchema = z.object({
  payload: ChatMessageSchema,
  error: z.boolean().default(false),
  event: z.enum(['message']).default('message'),
});

export const StatusChangePayloadSchema = z.object({
  userId: z.string(),
  status: UserStatusSchema,
});

export const StatusChangeEventSchema = z.object({
  payload: StatusChangePayloadSchema,
  error: z.boolean().default(false),
  event: z.literal('status_change'),
});

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
export type ChatMessageDTO = z.infer<typeof ChatMessagesSchema>;
export type ChatConnectionQueryDTO = z.infer<typeof ChatConnectionQuerySchema>;
export type StatusChangePayloadDTO = z.infer<typeof StatusChangePayloadSchema>;
