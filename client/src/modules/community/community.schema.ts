import { z } from 'zod';
import type { UserDTO } from '../user/user.schema';

export const communitiesSearchParamsSchema = z.object({
  search: z.string().optional().catch(''),
  explore: z.coerce.boolean().optional().catch(false),
});

export type CommunitiesSearchParams = z.infer<typeof communitiesSearchParamsSchema>;

export type CommunitiesQuery = {
  search?: string;
  isMember?: boolean;
};

export type CommunityDTO = {
  _id: string;
  title: string;
  userId: string;
  imageUrl?: string;
  isMember: boolean | null;
  description: string | null;
  totalMembers: number;
  onlineMembers: number;
};

export const createCommunitySchema = z.object({
  title: z.string().trim().min(1, { error: 'The title is required' }),
  description: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val)),
});

export type CreateCommunityDTO = z.infer<typeof createCommunitySchema>;

export type CommunityMemberDTO = {
  user: UserDTO;
  communityId: string;
};
