import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { toast } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { toastStyles } from '@/components/ui/sonner';
import { UnauthorizedError } from '@/lib/api';
import { AuthProvider } from '@/modules/auth/auth.context';

const MAX_QUERY_FAILURE = 4;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof UnauthorizedError) {
          return false;
        }

        return failureCount < MAX_QUERY_FAILURE;
      },
    },
    mutations: {
      onError: (error) => {
        toast.error(error.message, toastStyles.error);
      },
    },
  },
});

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="chat-community:ui-theme">
        <Outlet />
      </ThemeProvider>
    </AuthProvider>

    <ReactQueryDevtools />
    <TanStackRouterDevtools />
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: RootLayout });
