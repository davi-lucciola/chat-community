import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toastStyles } from '@/components/ui/sonner';
import type { CommunityDTO } from '../community.schema';
import communityService from '../community.service';

type LeaveCommunityDialogProps = {
  community: CommunityDTO;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function LeaveCommunityDialog({
  community,
  isOpen,
  setIsOpen,
}: LeaveCommunityDialogProps) {
  const navigate = useNavigate();

  const { mutateAsync: stopBeingMember, isPending } = useMutation({
    mutationKey: ['community', community._id, 'join'],
    mutationFn: communityService.stopBeingMember,
  });

  const onStopBeingMember = async () => {
    const { message } = await stopBeingMember(community._id);

    navigate({
      to: '/communities',
      params: { communityId: community._id },
    });

    toast.success(message, toastStyles.success);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p>
          You will leave the <span className="font-bold">{community.title}</span>. If
          the community is private you will need to be invited again latter.
        </p>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} type="button" variant="secondary">
            Cancel
          </Button>
          <Button onClick={onStopBeingMember} type="button" variant="destructive">
            Leave
            {isPending && <Loader className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
