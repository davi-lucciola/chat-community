import { z } from 'zod';
import { UserBasicSchema } from '../user/user.schema';

export const ChatConnectionQuerySchema = z.object({
  communityId: z.string({ error: 'The community id is required to enter the chat' }),
});

export const ChatMessageSchema = z.object({
  message: z.string({ error: 'The message is required' }),
});

export const ChatMessageResponseSchema = ChatMessageSchema.extend({
  user: UserBasicSchema.nullish(),
  error: z.boolean().default(false),
});

export type ChatMessageDTO = z.infer<typeof ChatMessageSchema>;
export type ChatConnectionQueryDTO = z.infer<typeof ChatConnectionQuerySchema>;
