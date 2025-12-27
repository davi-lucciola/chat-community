import { api } from '@/lib/api';
import type { CommunitiesQuery, CommunityDTO } from './community.schema';

async function getCommunities(query: CommunitiesQuery) {
  const res = await api.get<CommunityDTO[]>('/communities', {
    params: query,
  });

  return res.data;
}

export default {
  getCommunities,
};
