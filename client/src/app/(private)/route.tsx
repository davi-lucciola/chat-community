import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { setUnauthorizedHandler } from '@/lib/api';
import { useAuth } from '@/modules/auth/auth.context';

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
});

function PrivateLayout() {
  const { unauthorizedHandler } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(unauthorizedHandler);
    return () => setUnauthorizedHandler(undefined);
  }, [unauthorizedHandler]);

  return <Outlet />;
}
