import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserDTO } from '../user.schema';

type UserAvatarProps = {
  user?: UserDTO;
};

export function UserAvatar({ user }: UserAvatarProps) {
  if (!user) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  return (
    <Avatar className="size-10">
      <AvatarImage src={user.imageUrl} />
      <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
