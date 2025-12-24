import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './router.tsx';
import './index.css';
import { Toaster } from './components/ui/sonner.tsx';

// biome-ignore lint/style/noNonNullAssertion: React Main File Needs This
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
