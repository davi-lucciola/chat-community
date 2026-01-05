import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserBasicDTO, UserDTO } from '../user.schema';

type UserAvatarProps = {
  user: UserDTO | UserBasicDTO;
};

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar className="size-10">
      <AvatarImage src={user.imageUrl ?? ''} />
      <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
