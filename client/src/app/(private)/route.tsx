import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { NavigationHeader } from '@/components/navigation';
import { useAuth } from '@/modules/auth/auth.context';
import { UserContextProvider } from '@/modules/user/user.context';

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
});

function PrivateLayout() {
  const { user, isFechingUser } = useAuth();

  if (isFechingUser) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavigationHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
}
