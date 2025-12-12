import { z } from 'zod';
import { UserBasicSchema } from '../user/user.schema';

export const CommunityIdSchema = z.object({
  id: z.string(),
});

export const CommunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  ownerUser: UserBasicSchema,
});

export const CommunitysSchema = z.array(CommunitySchema);

export const CreateCommunitySchema = z.object({
  title: z.string({ error: 'Title must be a string.' }),
  description: z.string({ error: 'Description must be a string. ' }).nullish(),
});

export type CommunityIdDTO = z.infer<typeof CommunityIdSchema>;
export type CommunityDTO = z.infer<typeof CommunitySchema>;
export type CreateCommunityDTO = z.infer<typeof CreateCommunitySchema>;
