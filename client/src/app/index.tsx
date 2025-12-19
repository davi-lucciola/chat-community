import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/header';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <Header />;
}
