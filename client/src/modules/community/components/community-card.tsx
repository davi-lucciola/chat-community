// import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { CommunityDTO } from '../community.schema';

type CommunityCardProps = {
  community: CommunityDTO;
};

export function CommunityCard({ community }: CommunityCardProps) {
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
        {community.description != null ? community.description : '<No description>'}
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
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer">
          Join Community
        </Button>
      )}
    </Card>
  );
}
