import { api } from '@/lib/api';
import type { ChatMessageDTO } from './chat.schema';

// async function connect(communityId: string) {}

async function getMessages(communityId: string) {
  const res = await api.get<ChatMessageDTO[]>('/chat/messages', {
    params: { communityId },
  });

  return res.data;
}

export default {
  getMessages,
};
