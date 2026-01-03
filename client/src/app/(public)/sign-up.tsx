import { createFileRoute } from '@tanstack/react-router';
import { SignUpPage } from '@/modules/auth/pages/sign-up';

export const Route = createFileRoute('/(public)/sign-up')({
  component: SignUpPage,
});
