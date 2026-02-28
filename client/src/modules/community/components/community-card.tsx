// import { Badge } from '@/components/ui/badge';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toastStyles } from '@/components/ui/sonner';
import type { CommunityDTO } from '../community.schema';
import communityService from '../community.service';

type CommunityCardProps = {
  community: CommunityDTO;
};

export function CommunityCard({ community }: CommunityCardProps) {
  const navigate = useNavigate();

  const { mutateAsync: becomeMember, isPending } = useMutation({
    mutationKey: ['community', community._id, 'join'],
    mutationFn: communityService.becomeMember,
  });

  const onBecomeMember = async () => {
    const { message } = await becomeMember(community._id);

    navigate({
      to: '/community/$communityId/chat',
      params: { communityId: community._id },
    });

    toast.success(message, toastStyles.success);
  };

  return (
    <Card key={community._id} className="p-6 hover:bg-card/80 transition-colors h-full">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="size-16 rounded-lg">
          <AvatarImage src={community.imageUrl || '/placeholder.svg'} />
          <AvatarFallback className="rounded-lg">{community.title[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-card-foreground truncate">
              {community.title}
            </h3>
            {/* {community.trending && (
                <TrendingUp className="size-4 text-primary shrink-0" />
              )} */}
          </div>
          {/* <Badge variant="secondary" className="text-xs">
              {community.category}
            </Badge> */}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {community.description ?? (
          <span className="italic opacity-50">No description provided.</span>
        )}
      </p>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="size-4" />
          <span>{community.totalMembers.toLocaleString()} members</span>
        </div>
        <div className="flex items-center gap-1 text-green-500">
          <div className="size-2 rounded-full bg-green-500" />
          <span>{community.onlineMembers} online</span>
        </div>
      </div>

      {!community.isMember && (
        <Button
          disabled={isPending}
          onClick={onBecomeMember}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
        >
          Join Community
          {isPending && <Loader className="size-4 animate-spin" />}
        </Button>
      )}
    </Card>
  );
}
