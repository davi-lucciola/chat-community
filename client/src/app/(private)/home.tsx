import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/modules/auth/auth.context';

export const Route = createFileRoute('/(private)/home')({
  component: HomePage,
});

function HomePage() {
  const { user, isFechingUser } = useAuth();

  console.log(user);

  if (isFechingUser) {
    return <Loader2 className="w-16 h-16 animate-spin" />;
  }

  return (
    <div>
      <p>Hello "/home"!</p>
      {user && <p> Seja bem vindo {user.name} </p>}
    </div>
  );
}
