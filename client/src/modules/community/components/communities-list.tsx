import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CommunitiesTabs } from '@/modules/community/components/communities-tabs';
import type { CommunitiesQuery, CommunitiesSearchParams } from '../community.schema';

type CommunitiesFilterProps = {
  filter: CommunitiesQuery;
  setFilter: (filter: CommunitiesQuery) => void;
};

export function CommunitiesList({ explore, search }: CommunitiesSearchParams) {
  const [filter, setFilter] = useState<CommunitiesQuery>({
    search: search,
    isMember: !explore,
  });

  const debounceDelayInMs = 300;
  const debouncedFilter = useDebounce(filter, debounceDelayInMs);

  return (
    <div>
      <CommunitiesFilter filter={filter} setFilter={setFilter} />
      <CommunitiesTabs filter={debouncedFilter} setFilter={setFilter} />
    </div>
  );
}

function CommunitiesFilter({ filter, setFilter }: CommunitiesFilterProps) {
  return (
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
  );
}
