import { useMutation } from '@tanstack/react-query';
import { Loader, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth.context';
import authService from '../auth.service';

export function SignOutButton() {
  const { unauthorizedHandler } = useAuth();

  const { mutateAsync: logout, isPending } = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: authService.signOut,
  });

  const onClick = async () => {
    const { message } = await logout();
    unauthorizedHandler(message);
  };

  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      variant="destructive"
      className="hover:cursor-pointer"
    >
      Sign-out
      {isPending && <Loader className="animate-spin" />}
      {!isPending && <LogOut />}
    </Button>
  );
}
