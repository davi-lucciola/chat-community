import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/modules/auth/auth.context';
import authService from '@/modules/auth/auth.service';
import { UserAvatar } from './user-avatar';

export function UserProfileDropdown() {
  const { user, unauthorizedHandler } = useAuth();

  const { mutateAsync: logout, isPending } = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: authService.signOut,
  });

  const signOut = async () => {
    const { message } = await logout();
    unauthorizedHandler(message);
  };

  if (!user) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-0">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          disabled={isPending}
          variant="destructive"
          className="flex justify-between hover:cursor-pointer"
        >
          Log out
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
