import {
  CommunityHeaderActions,
  CommunityHeaderActionsSkeleton,
} from './community-header-actions';
import {
  CommunityHeaderInfo,
  CommunityHeaderInfoSkeleton,
} from './community-header-info';

export function CommunityHeader() {
  return (
    <div className="border-b border-border/40 bg-card/30 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <CommunityHeaderInfo />
        <CommunityHeaderActions />
      </div>
    </div>
  );
}

export function CommunityHeaderSkeleton() {
  return (
    <div className="border-b border-border/40 bg-card/30 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <CommunityHeaderInfoSkeleton />
        <CommunityHeaderActionsSkeleton />
      </div>
    </div>
  );
}
