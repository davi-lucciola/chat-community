import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { setUnauthorizedHandler } from '@/lib/api';
import { useAuth } from '@/modules/auth/auth.context';

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
});

function PrivateLayout() {
  const queryClient = useQueryClient();
  const { unauthorizedHandler } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(unauthorizedHandler);
    queryClient.refetchQueries({ queryKey: ['user'] });

    return () => setUnauthorizedHandler(undefined);
  }, [unauthorizedHandler, queryClient]);

  return <Outlet />;
}
