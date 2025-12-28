import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useDebounce } from '@uidotdev/usehooks';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CommunitiesQuery, CommunityDTO } from '../community.schema';
import communityService from '../community.service';
import { CommunityCard } from './community-card';

type CommunitiesProps = {
  search?: string;
  explore?: boolean;
};

type CommunitiesTabProps = {
  filter: CommunitiesQuery;
  communities?: CommunityDTO[];
};

type CommunityTab = 'explore-communities' | 'my-communities';

export function CommunitiesTabs({ search, explore }: CommunitiesProps) {
  const [tab, setTab] = useState<CommunityTab>(
    explore ? 'explore-communities' : 'my-communities',
  );

  const [filter, setFilter] = useState<CommunitiesQuery>({
    search: search,
    isMember: !explore,
  });
  const debounceDelayInMs = 300;
  const debouncedFilter = useDebounce(filter, debounceDelayInMs);

  const { data: communities } = useQuery({
    queryKey: ['communities', debouncedFilter],
    queryFn: () => communityService.getCommunities(debouncedFilter),
  });

  const onTabChange = (value: string) => {
    const newTab = value as CommunityTab;
    setTab(newTab);
    setFilter({ ...filter, isMember: newTab !== 'explore-communities' });
  };

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search communities..."
          value={filter.search ?? ''}
          onChange={(e) =>
            setFilter({
              ...filter,
              search: e.target.value === '' ? undefined : e.target.value,
            })
          }
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} className="w-full" onValueChange={onTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
          <TabsTrigger value="explore-communities">Explore</TabsTrigger>
        </TabsList>

        {/* My Communities Tab */}
        <TabsContent value="my-communities" className="space-y-4">
          <MyCommunitiesTab communities={communities} filter={filter} />
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="explore-communities" className="space-y-4">
          <ExploreCommunitiesTab communities={communities} filter={filter} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function CommunitiesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="w-96 h-67.5" />
      <Skeleton className="w-96 h-67.5" />
      <Skeleton className="w-96 h-67.5" />
    </div>
  );
}

function MyCommunitiesTab({ communities, filter }: CommunitiesTabProps) {
  if (!communities) {
    return <CommunitiesTabSkeleton />;
  }

  return (
    <>
      {communities.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-muted-foreground mb-4">
            {filter.search
              ? 'Try a different search term'
              : "You haven't joined any communities yet"}
          </p>
          <Button variant="outline">Browse Communities</Button>
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
    </>
  );
}

function ExploreCommunitiesTab({ communities }: CommunitiesTabProps) {
  if (!communities) {
    return <CommunitiesTabSkeleton />;
  }

  return (
    <>
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
    </>
  );
}
