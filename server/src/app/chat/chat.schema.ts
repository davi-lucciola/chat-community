import { z } from 'zod';
import { UserBasicSchema } from '../user/user.schema';

export const ChatIdSchema = z.object({
  id: z.string(),
});

export const ChatSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  ownerUser: UserBasicSchema,
});

export const ChatsSchema = z.array(ChatSchema);

export const CreateChatSchema = z.object({
  title: z.string({ error: 'Title must be a string.' }),
  description: z.string({ error: 'Description must be a string. ' }).nullish(),
});

export type ChatIdDTO = z.infer<typeof ChatIdSchema>;
export type ChatDTO = z.infer<typeof ChatSchema>;
export type CreateChatDTO = z.infer<typeof CreateChatSchema>;
