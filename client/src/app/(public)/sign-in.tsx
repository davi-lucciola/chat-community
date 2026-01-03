import { createFileRoute } from '@tanstack/react-router';
import { SignInPage } from '@/modules/auth/pages/sign-in';

export const Route = createFileRoute('/(public)/sign-in')({
  component: SignInPage,
});
