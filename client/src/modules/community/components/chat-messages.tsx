import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useChat } from '../chat.context';
import chatService from '../chat.service';

export function ChatMessages() {
  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <ScrollArea className="h-full">
        <Suspense fallback={<MessagesSkeleton />}>
          <Messages />
        </Suspense>
      </ScrollArea>
    </div>
  );
}

function Messages() {
  const { community } = useChat();

  const { data: messages } = useSuspenseQuery({
    queryKey: ['community', community._id, 'messages'],
    queryFn: () => chatService.getMessages(community._id),
  });

  return (
    <div className="flex flex-col-reverse gap-6 px-6 py-4">
      {messages.map((msg) => (
        <div key={msg._id} className="flex items-start gap-4">
          <Avatar className="size-12.5 shrink-0">
            <AvatarImage src={msg.user.imageUrl ?? ''} />
            <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-foreground">{msg.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>
            <p className="text-foreground leading-relaxed">{msg.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="flex flex-col-reverse gap-6 px-6 py-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="size-12.5 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <ScrollArea className="h-full">
        <MessagesSkeleton />
      </ScrollArea>
    </div>
  );
}
