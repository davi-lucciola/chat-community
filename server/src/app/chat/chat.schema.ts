import { z } from 'zod';
import { UserBasicSchema } from '../user/user.schema';

export const ChatConnectionQuerySchema = z.object({
  communityId: z.string({ error: 'The community id is required to enter the chat' }),
});

export const SendMessageSchema = z.object({
  message: z.string({ error: 'The message is required' }),
});

export const ChatMessageSchema = z.array(
  z.object({
    _id: z.coerce.string(),
    message: z.string(),
    user: UserBasicSchema,
    communityId: z.coerce.string(),
    createdAt: z.date().transform((value) => value.toISOString()),
  }),
);

export const ChatMessageResponseSchema = SendMessageSchema.extend({
  user: UserBasicSchema.nullish(),
  error: z.boolean().default(false),
});

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
export type ChatMessageDTO = z.infer<typeof ChatMessageSchema>;
export type ChatConnectionQueryDTO = z.infer<typeof ChatConnectionQuerySchema>;
