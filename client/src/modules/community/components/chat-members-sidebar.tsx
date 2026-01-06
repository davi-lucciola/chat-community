import { useSuspenseQuery } from '@tanstack/react-query';
import { UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/modules/user/components/user-avatar';
import { useChat } from '../chat.context';
import communityService from '../community.service';

export function ChatMembersSidebar() {
  return (
    <div className="w-80 border-l border-border/40 bg-card/30 flex flex-col min-h-0">
      <div className="border-b border-border/40 px-4 py-4 shrink-0">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <UsersIcon className="size-5" />
          Members
        </h3>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <ChatMembers />
      </div>
    </div>
  );
}

function ChatMembers() {
  const { community } = useChat();

  const { data: members } = useSuspenseQuery({
    queryKey: ['community', community._id, 'members'],
    queryFn: async () => communityService.getMembers(community._id),
  });

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Online Users */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase">
              Online
            </h4>
            <Badge variant="secondary" className="text-xs">
              {members.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {members.map(({ user }) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <UserAvatar user={user} />
                  <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {user.name}
                  </p>
                  {/* <p className="text-xs text-muted-foreground truncate">
                    {user.status}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Users */}

        {/* <Separator />

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
                      <UserAvatar user={user} />
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
            </div> */}
      </div>
    </ScrollArea>
  );
}

function ChatMembersSkeleton() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Online Users */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase">
              Online
            </h4>
            <Badge variant="secondary" className="text-xs h-5 w-6"></Badge>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Skeleton className="size-10 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export function ChatMembersSidebarSkeleton() {
  return (
    <div className="w-80 border-l border-border/40 bg-card/30 flex flex-col min-h-0">
      <div className="border-b border-border/40 px-4 py-4 shrink-0">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <UsersIcon className="size-5" />
          Members
        </h3>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <ChatMembersSkeleton />
      </div>
    </div>
  );
}
