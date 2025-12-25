import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/community/$communityId/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  const { communityId } = Route.useParams();
  return <div>Hello Inside the community "{communityId}" </div>;
}
