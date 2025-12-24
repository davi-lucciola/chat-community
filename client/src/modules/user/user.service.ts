import { api } from '@/lib/api';
import type { UserDTO } from '@/modules/user/user.schema';

async function getCurrentUser() {
  const res = await api.get<UserDTO>('/user');
  return res.data;
}

export default {
  getCurrentUser,
};
