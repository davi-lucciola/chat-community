import { Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useChat } from '../chat.context';

export function CommunityHeaderInfo() {
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

export function CommunityHeaderInfoSkeleton() {
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
