import { z } from 'zod';

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
