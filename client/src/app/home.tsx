import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth.context';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
});

function RouteComponent() {
  // const navigate = useNavigate();
  const { user, isPending } = useAuth();

  if (isPending) {
    return <Loader2 className="w-16 h-16 animate-spin" />;
  }

  return (
    <div>
      <p>Hello "/home"!</p>
      {isPending && <p> Carregando... </p>}
      {user && <p> Seja bem vindo {user.name} </p>}
    </div>
  );
}
