import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NavigationHeader } from '@/components/navigation';

import { CommunitiesTabs } from '@/modules/community/components/communities-tabs';
import { CreateCommunityDialog } from '@/modules/community/components/create-community-dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { CommunitiesQuery } from '@/modules/community/community.schema';
import { useDebounce } from '@uidotdev/usehooks';

const communitiesParamsSchema = z.object({
  search: z.string().optional().catch(''),
  explore: z.coerce.boolean().optional().catch(false),
});

type CommunitiesParams = z.infer<typeof communitiesParamsSchema>;

export const Route = createFileRoute('/(private)/communities')({
  component: CommunitiesPage,
  validateSearch: (search) => communitiesParamsSchema.parse(search),
});

function CommunitiesPage() {
  const params = Route.useSearch();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('overflow-y-scroll');

    return () => html.classList.remove('overflow-y-scroll');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunitiesHeader />
        <CommunitiesContent {...params} />
      </div>
    </div>
  );
}

export function CommunitiesHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Communities</h1>
        <p className="text-muted-foreground">
          Discover and join communities that interest you
        </p>
      </div>
      <CreateCommunityDialog />
    </div>
  );
}

export function CommunitiesContent({ explore, search }: CommunitiesParams) {
  const [filter, setFilter] = useState<CommunitiesQuery>({
    search: search,
    isMember: !explore,
  });

  const debounceDelayInMs = 300;
  const debouncedFilter = useDebounce(filter, debounceDelayInMs);

  return (
    <div>
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

      <CommunitiesTabs filter={debouncedFilter} setFilter={setFilter} />
    </div>
  );
}
