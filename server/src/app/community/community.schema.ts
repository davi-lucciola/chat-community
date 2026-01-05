import { z } from 'zod';
import { UserBasicSchema } from '../user/user.schema';

export const CommunityIdSchema = z.object({
  id: z.string(),
});

export const CommunitySchema = z.object({
  _id: z.coerce.string(),
  title: z.string(),
  userId: z.coerce.string(),
  description: z.string().nullable().default(null),
  isMember: z.boolean().nullish().default(null),
  totalMembers: z.number(),
  onlineMembers: z.number(),
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

const CommunityMemberSchema = z.object({
  user: UserBasicSchema,
  communityId: z.coerce.string(),
});

export const CommunityMembersSchema = z.array(CommunityMemberSchema);
export type CommunityMemberDTO = z.infer<typeof CommunityMemberSchema>;
