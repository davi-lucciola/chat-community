import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/auth.context';
import { UserAvatar } from '@/modules/user/components/user-avatar';
import { ChatCommunityLogo } from './logo';

type NavigationHeaderProps = React.ComponentProps<'nav'>;

export function NavigationHeader({ className, ...props }: NavigationHeaderProps) {
  const { user } = useAuth();

  return (
    <nav
      {...props}
      className={twMerge(
        'border-b border-border/40 backdrop-blur-sm z-50 bg-background/80',
        className,
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/communities" className="flex items-center gap-2">
            <ChatCommunityLogo />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/communities">
              <Button variant="ghost">Communities</Button>
            </Link>
            <UserAvatar user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
