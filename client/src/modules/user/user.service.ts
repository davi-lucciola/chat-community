import { api } from '@/lib/api';
import type { UserDTO } from '@/modules/user/user.schema';

function connect() {
  const url = api.getUri().replace('https', 'ws').replace('http', 'ws');
  return new WebSocket(`${url}/user/connect`);
}

async function getCurrentUser() {
  const res = await api.get<UserDTO>('/user');
  return res.data;
}

export default {
  connect,
  getCurrentUser,
};
