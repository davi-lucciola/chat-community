import { createFileRoute } from '@tanstack/react-router';
import { communitiesSearchParamsSchema } from '@/modules/community/community.schema';
import { CommunitiesPage } from '@/modules/community/pages/communities';

export const Route = createFileRoute('/(private)/communities')({
  component: CommunitiesPage,
  validateSearch: (search) => communitiesSearchParamsSchema.parse(search),
});
