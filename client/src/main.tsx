import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme/theme-provider.tsx';
import { router } from './router.tsx';
import './index.css';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: React Main File Needs This
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="chat-community:ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
