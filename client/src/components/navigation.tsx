import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';
import { UserProfileDropdown } from '@/modules/user/components/user-profile-dropdown';
import { ChatCommunityLogo } from './logo';
import { ThemeToogle } from './theme/theme-toggle';

type NavigationHeaderProps = React.ComponentProps<'nav'>;

export function NavigationHeader({ className, ...props }: NavigationHeaderProps) {
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
            {/* <Link to="/">
              <Button variant="ghost" className="hover:cursor-pointer">
                Home
              </Button>
            </Link> */}
            <ThemeToogle />
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
