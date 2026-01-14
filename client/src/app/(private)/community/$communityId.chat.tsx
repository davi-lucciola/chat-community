import { createFileRoute } from '@tanstack/react-router';
import { CommunityChatPage } from '@/modules/chat/pages/community-chat';

export const Route = createFileRoute('/(private)/community/$communityId/chat')({
  component: CommunityChatPage,
});
