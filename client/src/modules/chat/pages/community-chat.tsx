import { Suspense } from 'react';
import { Route } from '@/app/(private)/community/$communityId.chat';
import { NavigationHeader } from '@/components/navigation';
import {
  CommunityHeader,
  CommunityHeaderSkeleton,
} from '@/modules/chat/components/community-header';
import { ChatContextProvider } from '../chat.context';
import {
  ChatMembersSidebar,
  ChatMembersSidebarSkeleton,
} from '../components/chat-members-sidebar';
import { ChatMessages, ChatMessagesSkeleton } from '../components/chat-messages';

export function CommunityChatPage() {
  const { communityId } = Route.useParams();

  return (
    <div className="h-screen flex flex-col bg-background">
      <NavigationHeader />

      <Suspense fallback={<CommunityChatSkeleton />}>
        <ChatContextProvider communityId={communityId}>
          <CommunityChat />
        </ChatContextProvider>
      </Suspense>
    </div>
  );
}

function CommunityChat() {
  return (
    <div className="container m-auto flex-1 flex overflow-hidden min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <CommunityHeader />
        <ChatMessages />
      </div>
      <ChatMembersSidebar />
    </div>
  );
}

export function CommunityChatSkeleton() {
  return (
    <div className="container m-auto flex-1 flex overflow-hidden min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <CommunityHeaderSkeleton />
        <ChatMessagesSkeleton />
      </div>

      <ChatMembersSidebarSkeleton />
    </div>
  );
}
