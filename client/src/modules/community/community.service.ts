import { api, type MessageDTO } from '@/lib/api';
import type {
  CommunitiesQuery,
  CommunityDTO,
  CommunityMemberDTO,
  CreateCommunityDTO,
} from './community.schema';

async function getCommunities(query: CommunitiesQuery) {
  const res = await api.get<CommunityDTO[]>('/communities', {
    params: query,
  });

  return res.data;
}

async function getCommunityById(id: string) {
  const res = await api.get<CommunityDTO>(`/communities/${id}`);
  return res.data;
}

async function createCommunity(createCommunityDto: CreateCommunityDTO) {
  const res = await api.post('/communities', createCommunityDto);
  return res.data;
}

async function getMembers(communityId: string) {
  const res = await api.get<CommunityMemberDTO[]>(
    `/communities/${communityId}/members`,
  );
  return res.data;
}

async function becomeMember(communityId: string) {
  const res = await api.put<MessageDTO>(`/communities/${communityId}/member`);
  return res.data;
}

export default {
  getCommunities,
  getCommunityById,
  createCommunity,
  getMembers,
  becomeMember,
};
