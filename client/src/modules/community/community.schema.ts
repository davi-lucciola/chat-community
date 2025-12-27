export type CommunitiesQuery = {
  search?: string;
  isMember?: boolean;
};

export type CommunityDTO = {
  id: string;
  title: string;
  userId: string;
  imageUrl?: string;
  isMember?: boolean;
  description: string | null;
  totalMembers: number;
  onlineMembers: number;
};
