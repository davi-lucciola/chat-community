import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/modules/auth/auth.context';
import { SignOutButton } from '@/modules/auth/components/sign-out-button';

export const Route = createFileRoute('/(private)/home')({
  component: HomePage,
});

function HomePage() {
  const { user, isFechingUser } = useAuth();

  if (isFechingUser || !user) {
    return <Loader2 className="w-16 h-16 animate-spin" />;
  }

  return (
    <div>
      <p>Hello "/home"!</p>
      <p> Seja bem vindo {user.name} </p>
      <SignOutButton />
    </div>
  );
}
