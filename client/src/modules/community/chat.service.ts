import { api } from '@/lib/api';
import type { ChatMessageDTO } from './chat.schema';

function connect(communityId: string) {
  const url = api.getUri().replace('http', 'ws');
  const params = new URLSearchParams({ communityId });

  const socket = new WebSocket(`${url}/chat/connect?${params.toString()}`);
  return socket;
}

async function getMessages(communityId: string) {
  const res = await api.get<ChatMessageDTO[]>('/chat/messages', {
    params: { communityId },
  });

  return res.data;
}

export default {
  connect,
  getMessages,
};
