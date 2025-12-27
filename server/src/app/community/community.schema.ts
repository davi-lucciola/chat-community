import { z } from 'zod';

export const CommunityIdSchema = z.object({
  id: z.string(),
});

export const CommunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  description: z.string().nullable(),
  onlineMembers: z.number(),
  membersQuantity: z.number(),
});

export const CommunitiesSchema = z.array(CommunitySchema);

export const CommunitiesQuerySchema = z.object({
  search: z.string().optional(),
  isMember: z.stringbool().optional(),
});

export const CreateCommunitySchema = z.object({
  title: z.string({ error: 'Title must be a string.' }),
  description: z.string({ error: 'Description must be a string. ' }).nullish(),
});

export type CommunityDTO = z.infer<typeof CommunitySchema>;
export type CommunityIdDTO = z.infer<typeof CommunityIdSchema>;
export type CreateCommunityDTO = z.infer<typeof CreateCommunitySchema>;
export type CommunitiesQueryDTO = z.infer<typeof CommunitiesQuerySchema>;
