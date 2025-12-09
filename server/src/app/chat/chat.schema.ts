import { z } from 'zod';

export const chatIdSchema = z.object({
  id: z.string(),
});

export const chatSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdByUser: z.object({
    name: z.string(),
  }),
});

export const chatsSchema = z.array(chatSchema);

export const createChatSchema = z.object({
  title: z.string({ error: 'Title must be a string.' }),
  description: z.string({ error: 'Description must be a string. ' }),
});

export type ChatIdDTO = z.infer<typeof chatIdSchema>;
export type ChatDTO = z.infer<typeof chatSchema>;
export type CreateChatDTO = z.infer<typeof createChatSchema>;
