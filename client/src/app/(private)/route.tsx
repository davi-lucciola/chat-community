import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth.context';
import { setUnauthorizedHandler } from '@/lib/api';

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
