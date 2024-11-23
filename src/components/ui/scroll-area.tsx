import React from 'react';
import { cn } from '../../lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          orientation === 'vertical' ? 'h-full' : 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

ScrollArea.displayName = 'ScrollArea';