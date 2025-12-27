import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod';
import { NavigationHeader } from '@/components/navigation';

import { Button } from '@/components/ui/button';
import { CommunitiesTabs } from '@/modules/community/components/communities-tabs';

const communitiesParamsSchema = z.object({
  search: z.string().optional().catch(''),
  explore: z.coerce.boolean().optional().catch(false),
});

export const Route = createFileRoute('/(private)/communities')({
  component: CommunitiesPage,
  validateSearch: (search) => communitiesParamsSchema.parse(search),
});

function CommunitiesPage() {
  const { explore, search } = Route.useSearch();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('overflow-y-scroll');

    return () => html.classList.remove('overflow-y-scroll');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Communities</h1>
            <p className="text-muted-foreground">
              Discover and join communities that interest you
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4 mr-2" />
            Create Community
          </Button>
        </div>

        <CommunitiesTabs explore={explore} search={search} />
      </div>
    </div>
  );
}
