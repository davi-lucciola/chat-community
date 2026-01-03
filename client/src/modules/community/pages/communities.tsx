import { useEffect } from 'react';
import { Route } from '@/app/(private)/communities';
import { NavigationHeader } from '@/components/navigation';

import { CreateCommunityDialog } from '@/modules/community/components/create-community-dialog';
import { CommunitiesList } from '../components/communities-list';

export function CommunitiesPage() {
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Communities</h1>
            <p className="text-muted-foreground">
              Discover and join communities that interest you
            </p>
          </div>
          <CreateCommunityDialog />
        </div>

        <CommunitiesList {...params} />
      </div>
    </div>
  );
}
