import { createFileRoute } from '@tanstack/react-router';
import {
  Hash,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  UsersIcon,
} from 'lucide-react';
import { useState } from 'react';
import { NavigationHeader } from '@/components/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/(private)/community/$communityId/chat')({
  component: CommunityChatPage,
});

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: '/user-avatar-1.png',
      online: true,
    },
    content:
      'Hey everyone! Just deployed my first Next.js 16 app. The new features are amazing!',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    user: {
      name: 'Mike Johnson',
      avatar: '/user-avatar-2.png',
      online: true,
    },
    content: 'Congratulations Sarah! How are you finding the new cache components?',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    user: {
      name: 'Sarah Chen',
      avatar: '/user-avatar-1.png',
      online: true,
    },
    content:
      "They're really powerful! The 'use cache' directive makes it so much easier to optimize performance.",
    timestamp: '10:35 AM',
  },
  {
    id: '4',
    user: {
      name: 'Alex Rivera',
      avatar: '/user-avatar-3.png',
      online: false,
    },
    content:
      "I've been working with the React 19 features. useEffectEvent is a game changer!",
    timestamp: '10:40 AM',
  },
  {
    id: '5',
    user: {
      name: 'Emma Wilson',
      avatar: '/user-avatar-4.png',
      online: true,
    },
    content:
      'Has anyone tried the new Activity component yet? Looking for real-world use cases.',
    timestamp: '10:45 AM',
  },
];

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/user-avatar-1.png',
    status: 'Building with Next.js',
    online: true,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: '/user-avatar-2.png',
    status: 'Coffee break',
    online: true,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: '/user-avatar-4.png',
    status: 'Coding',
    online: true,
  },
  {
    id: '4',
    name: 'David Park',
    avatar: '/user-avatar-5.png',
    status: 'In a meeting',
    online: true,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    avatar: '/user-avatar-6.png',
    status: 'Active now',
    online: true,
  },
  {
    id: '6',
    name: 'Alex Rivera',
    avatar: '/user-avatar-3.png',
    status: 'Last seen 2h ago',
    online: false,
  },
  {
    id: '7',
    name: 'Tom Bradley',
    avatar: '/user-avatar-7.png',
    status: 'Last seen yesterday',
    online: false,
  },
];

// Mock community data
const communityData = {
  '1': { name: 'Web Developers', members: 15234, online: 892 },
  '2': { name: 'Design Systems', members: 8421, online: 234 },
  '3': { name: 'React Enthusiasts', members: 21567, online: 1453 },
};

function CommunityChatPage() {
  const { communityId } = Route.useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const community = communityData[communityId as keyof typeof communityData] || {
    name: 'Community',
    members: 0,
    online: 0,
  };

  const onlineUsers = mockUsers.filter((user) => user.online);
  const offlineUsers = mockUsers.filter((user) => !user.online);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: '/diverse-user-avatars.png',
        online: true,
      },
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <NavigationHeader />
      <div className="container m-auto flex-1 flex overflow-hidden min-h-0">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Channel Header */}
          <div className="border-b border-border/40 bg-card/30 px-6 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Hash className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {community.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {community.members.toLocaleString()} members • {community.online}{' '}
                    online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="size-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full">
              <div className="px-6 py-4 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={msg.user.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {msg.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="border-t border-border/40 bg-card/30 p-4 shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={`Message ${community.name}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
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
                onClick={handleSendMessage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 size-11 shrink-0"
                size="icon"
              >
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Users Sidebar */}
        <div className="w-80 border-l border-border/40 bg-card/30 flex flex-col min-h-0">
          <div className="border-b border-border/40 px-4 py-4 shrink-0">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <UsersIcon className="size-5" />
              Members
            </h3>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Online Users */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                      Online
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {onlineUsers.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {onlineUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="size-10">
                            <AvatarImage src={user.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 border-2 border-card" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Offline Users */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                      Offline
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {offlineUsers.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {offlineUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="size-10 opacity-60">
                            <AvatarImage src={user.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-muted border-2 border-card" />
                        </div>
                        <div className="flex-1 min-w-0 opacity-60">
                          <p className="font-medium text-sm text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
