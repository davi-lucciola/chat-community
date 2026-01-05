import { Paperclip, Send, Smile } from 'lucide-react';
import { Suspense } from 'react';
import { Route } from '@/app/(private)/community/$communityId.chat';
import { NavigationHeader } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CommunityHeader,
  CommunityHeaderSkeleton,
} from '@/modules/community/components/community-header';
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
  // const [message, setMessage] = useState('');

  // const handleSendMessage = () => {
  //   if (!message.trim()) return;

  //   const newMessage = {
  //     id: Date.now().toString(),
  //     user: {
  //       name: 'You',
  //       avatar: '/diverse-user-avatars.png',
  //       online: true,
  //     },
  //     content: message,
  //     timestamp: new Date().toLocaleTimeString('en-US', {
  //       hour: 'numeric',
  //       minute: '2-digit',
  //     }),
  //   };

  //   setMessage('');
  // };

  return (
    <div className="container m-auto flex-1 flex overflow-hidden min-h-0">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <CommunityHeader />
        <ChatMessages />

        {/* Message Input */}
        <div className="border-t border-border/40 bg-card/30 p-4 shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  // placeholder={`Message ${community.name}`}
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  // onKeyDown={(e) => {
                  //   if (e.key === 'Enter' && !e.shiftKey) {
                  //     e.preventDefault();
                  //     handleSendMessage();
                  //   }
                  // }}
                  className="pr-20 min-h-11 resize-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Smile className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Paperclip className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              // onClick={handleSendMessage}
              className="bg-primary text-primary-foreground hover:bg-primary/90 size-11 shrink-0"
              size="icon"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
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

        {/* Message Input */}
        <div className="border-t border-border/40 bg-card/30 p-4 shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  // placeholder={`Message ${community.name}`}
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  // onKeyDown={(e) => {
                  //   if (e.key === 'Enter' && !e.shiftKey) {
                  //     e.preventDefault();
                  //     handleSendMessage();
                  //   }
                  // }}
                  className="pr-20 min-h-11 resize-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Smile className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Paperclip className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              // onClick={handleSendMessage}
              className="bg-primary text-primary-foreground hover:bg-primary/90 size-11 shrink-0"
              size="icon"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <ChatMembersSidebarSkeleton />
    </div>
  );
}
