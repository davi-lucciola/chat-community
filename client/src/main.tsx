import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='system' storageKey='chat-community:ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
