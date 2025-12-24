import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/about')({
  component: AboutPage,
});

function AboutPage() {
  return <div className="p-2">Hello from About!</div>;
}
