import type * as React from 'react';

import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'filled';

interface InputProps extends React.ComponentProps<'input'> {
  variant?: InputVariant;
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(
        // Base styles
        'w-full min-w-0 rounded-md px-3 text-base outline-none transition-all selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // Default variant: bordered
        variant === 'default' && [
          'h-10 border border-input bg-transparent py-2 shadow-xs',
          'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
        ],
        // Filled variant: gray background, no border
        variant === 'filled' && [
          'h-12 border-none bg-muted py-3 shadow-sm',
          'focus-visible:bg-muted/80 focus-visible:ring-[3px] focus-visible:ring-primary/30',
        ],
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export type { InputVariant };
export { Input };
