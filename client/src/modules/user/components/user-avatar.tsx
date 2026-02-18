import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type UserStatus, UserStatusEnum } from '../user.schema';

type UserAvatarProps = {
  name: string;
  status?: UserStatus;
  imageUrl: string | null;
};

export function UserAvatar({ name, status, imageUrl }: UserAvatarProps) {
  const isOffline = status === UserStatusEnum.OFFLINE;

  return (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src={imageUrl ?? ''} />
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {!isOffline && (
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${status === 'ONLINE' ? 'bg-green-500' : 'bg-yellow-500'}`}
        />
      )}
    </div>
  );
}
