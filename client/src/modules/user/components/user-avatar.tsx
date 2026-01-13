import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  type UserBasicDTO,
  type UserDTO,
  type UserStatus,
  UserStatus as UserStatusConst,
} from '../user.schema';

type UserAvatarProps = {
  user: UserDTO | UserBasicDTO;
};

const statusColors: Record<UserStatus, string | null> = {
  [UserStatusConst.ONLINE]: 'bg-green-500',
  [UserStatusConst.IDLE]: 'bg-yellow-500',
  [UserStatusConst.OFFLINE]: null,
};

export function UserAvatar({ user }: UserAvatarProps) {
  const statusColor = user.status ? statusColors[user.status] : null;

  return (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src={user.imageUrl ?? ''} />
        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {statusColor && (
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${statusColor}`}
        />
      )}
    </div>
  );
}
