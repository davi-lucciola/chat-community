import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Search, Users } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CommunitiesQuery } from '../community.schema';
import communityService from '../community.service';
import { CommunityCard } from './community-card';

type CommunitiesProps = {
  filter: CommunitiesQuery;
  setFilter: (filter: CommunitiesQuery) => void;
};

type CommunityTab = 'explore-communities' | 'my-communities';

export function CommunitiesTabs({ filter, setFilter }: CommunitiesProps) {
  const tab = !filter.isMember ? 'explore-communities' : 'my-communities';

  const onTabChange = (value: string) => {
    const newTab = value as CommunityTab;
    setFilter({ ...filter, isMember: newTab !== 'explore-communities' });
  };

  return (
    <Tabs value={tab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="my-communities">My Communities</TabsTrigger>
        <TabsTrigger value="explore-communities">Explore</TabsTrigger>
      </TabsList>

      <Suspense fallback={<CommunitiesTabSkeleton />}>
        <MyCommunitiesTab {...{ filter, setFilter }} />
      </Suspense>

      <Suspense fallback={<CommunitiesTabSkeleton />}>
        <ExploreCommunitiesTab {...{ filter, setFilter }} />
      </Suspense>
    </Tabs>
  );
}

function MyCommunitiesTab({ filter, setFilter }: CommunitiesProps) {
  const { data: communities } = useSuspenseQuery({
    queryKey: ['communities', filter],
    queryFn: () => communityService.getCommunities(filter),
  });

  return (
    <TabsContent value="my-communities" className="space-y-4">
      {communities.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-muted-foreground mb-4">
            {filter.search
              ? 'Try a different search term'
              : "You haven't joined any communities yet"}
          </p>
          <Button
            variant="outline"
            onClick={() => setFilter({ search: '', isMember: false })}
          >
            Browse Communities
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link
              key={community._id}
              to="/community/$communityId/chat"
              params={{ communityId: community._id }}
            >
              <CommunityCard key={community._id} community={community} />
            </Link>
          ))}
        </div>
      )}
    </TabsContent>
  );
}

function ExploreCommunitiesTab({ filter }: CommunitiesProps) {
  const { data: communities } = useSuspenseQuery({
    queryKey: ['communities', filter],
    queryFn: () => communityService.getCommunities(filter),
  });

  return (
    <TabsContent value="explore-communities" className="space-y-4">
      {communities?.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities?.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}
    </TabsContent>
  );
}

function CommunitiesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="w-full h-67.5" />
      <Skeleton className="w-full h-67.5" />
      <Skeleton className="w-full h-67.5" />
    </div>
  );
}
