import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type UserStatus, UserStatusEnum } from '../user.schema';

type UserAvatarProps = {
  name: string;
  status?: UserStatus;
  imageUrl: string | null;
};

const statusColors: Record<UserStatus, string | null> = {
  [UserStatusEnum.ONLINE]: 'bg-green-500',
  [UserStatusEnum.IDLE]: 'bg-yellow-500',
  [UserStatusEnum.OFFLINE]: null,
};

export function UserAvatar({ name, status, imageUrl }: UserAvatarProps) {
  const statusColor = status ? statusColors[status] : null;

  return (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src={imageUrl ?? ''} />
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {statusColor && (
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${statusColor}`}
        />
      )}
    </div>
  );
}
