import { api } from '@/lib/api';
import type {
  CommunitiesQuery,
  CommunityDTO,
  CreateCommunityDTO,
} from './community.schema';

async function getCommunities(query: CommunitiesQuery) {
  const res = await api.get<CommunityDTO[]>('/communities', {
    params: query,
  });

  return res.data;
}

async function createCommunity(createCommunityDto: CreateCommunityDTO) {
  const res = await api.post('/communities', createCommunityDto);
  return res.data;
}

export default {
  getCommunities,
  createCommunity,
};
