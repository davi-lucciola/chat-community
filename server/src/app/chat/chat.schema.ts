import { z } from 'zod';

export const chatConnectionQuerySchema = z.object({
  communityId: z.string({ error: 'The community id is required to enter the chat' }),
});

export type ChatConnectionQueryDTO = z.infer<typeof chatConnectionQuerySchema>;
