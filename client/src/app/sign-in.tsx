import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
});

function SignIn() {
  return (
    <div>
      <h1>Entrar</h1>
    </div>
  );
}
