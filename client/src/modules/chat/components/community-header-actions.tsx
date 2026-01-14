import { MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LeaveCommunityDialog } from '../../community/components/leave-community-dialog';
import { useChat } from '../chat.context';

export function CommunityHeaderActions() {
  const { community } = useChat();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Search className="size-5" />
      </Button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setShowLeaveDialog(true)}
          >
            Leave Community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LeaveCommunityDialog
        community={community}
        isOpen={showLeaveDialog}
        setIsOpen={setShowLeaveDialog}
      />
    </div>
  );
}

export function CommunityHeaderActionsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Search className="size-5" />
      </Button>

      <Button variant="ghost" size="icon">
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}
