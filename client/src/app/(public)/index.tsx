import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/modules/home/pages/home';

export const Route = createFileRoute('/(public)/')({
  component: HomePage,
});
