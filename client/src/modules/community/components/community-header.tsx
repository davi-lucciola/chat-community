import { useSuspenseQuery } from '@tanstack/react-query';
import { Hash, MoreVertical, Search } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import communityService from '@/modules/community/community.service';

type CommunityHeaderProps = {
  communityId: string;
};

export function CommunityHeader({ communityId }: CommunityHeaderProps) {
  return (
    <div className="border-b border-border/40 bg-card/30 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <Suspense fallback={<CommunityInfoSkeleton />}>
          <CommunityInfo communityId={communityId} />
        </Suspense>

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
  );
}

export function CommunityInfo({ communityId }: CommunityHeaderProps) {
  const { data: community } = useSuspenseQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
  });

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

export function CommunityInfoSkeleton() {
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
