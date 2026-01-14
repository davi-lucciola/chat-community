import { createFileRoute, Outlet } from '@tanstack/react-router';
import { UserContextProvider } from '@/modules/user/user.context';

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
});

function PrivateLayout() {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
}
