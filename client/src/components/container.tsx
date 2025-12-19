import type React from 'react';
import { twMerge } from 'tailwind-merge';

type ContainerProps = React.ComponentProps<'div'>;

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={twMerge('max-w-360 w-full m-auto', className)} {...props}>
      {children}
    </div>
  );
}
