import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/auth.context';

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
    <Toaster />
    <ReactQueryDevtools />
    <TanStackRouterDevtools />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
