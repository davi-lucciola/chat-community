import { Paperclip, Send, Smile } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useChat } from '../chat.context';

export function ChatMessages() {
  return (
    <>
      <Messages />
      <MessageInput />
    </>
  );
}

function Messages() {
  const { messages } = useChat();

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <ScrollArea className="h-full">
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
      </ScrollArea>
    </div>
  );
}

function MessageInput() {
  const [message, setMessage] = useState('');
  const { community, sendMessage } = useChat();

  const handleOnClick = () => {
    if (message !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message !== '') {
      e.preventDefault();
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-border/40 bg-card/30 p-4 shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder={`Message ${community.title}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleOnKeyDown}
              className="pr-20 min-h-11 resize-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8">
                <Smile className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleOnClick}
              >
                <Paperclip className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <Button
          // onClick={sendMessage}
          className="bg-primary text-primary-foreground hover:bg-primary/90 size-11 shrink-0"
          size="icon"
        >
          <Send className="size-5" />
        </Button>
      </div>
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
    <>
      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <MessagesSkeleton />
        </ScrollArea>
      </div>
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
                //     sendMessage();
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
            // onClick={sendMessage}
            className="bg-primary text-primary-foreground hover:bg-primary/90 size-11 shrink-0"
            size="icon"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
