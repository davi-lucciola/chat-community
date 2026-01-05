import { Hash, MoreVertical, Search } from 'lucide-react';
import { type PropsWithChildren, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useChat } from '../chat.context';

export function CommunityHeader() {
  return (
    <HeaderShell>
      <Suspense fallback={<CommunityInfoSkeleton />}>
        <CommunityInfo />
      </Suspense>

      <HeaderActions />
    </HeaderShell>
  );
}

function CommunityInfo() {
  const { community } = useChat();

  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Hash className="size-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">{community.title}</h2>
        <p className="text-sm text-muted-foreground">
          {community.totalMembers.toLocaleString()} members • {community.onlineMembers}{' '}
          online
        </p>
      </div>
    </div>
  );
}

function CommunityInfoSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10" />
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
    </div>
  );
}

function HeaderShell({ children }: PropsWithChildren) {
  return (
    <div className="border-b border-border/40 bg-card/30 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
}

function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Search className="size-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}

export function CommunityHeaderSkeleton() {
  return (
    <HeaderShell>
      <CommunityInfoSkeleton />
      <HeaderActions />
    </HeaderShell>
  );
}
