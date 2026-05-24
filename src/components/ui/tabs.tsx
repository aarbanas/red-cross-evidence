'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

/**
 * Tabs variants:
 * - default: Underline style with red indicator
 * - pills: Pill/button style with filled background
 * - boxed: Card-style tabs with borders
 */
type TabsListVariant = 'default' | 'pills' | 'boxed';

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List> {
  variant?: TabsListVariant;
}

function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'inline-flex items-center text-muted-foreground',
        // Default: Underline style
        variant === 'default' && 'gap-6 border-b border-border',
        // Pills: Rounded pill buttons
        variant === 'pills' && 'gap-2 rounded-lg bg-muted p-1',
        // Boxed: Card-style with borders
        variant === 'boxed' &&
          'gap-0 rounded-lg border border-border overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  variant?: TabsListVariant;
}

function TabsTrigger({
  className,
  variant = 'default',
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',

        // Default: Underline style
        variant === 'default' && [
          'relative px-1 pb-3 text-muted-foreground',
          'hover:text-foreground',
          'data-[state=active]:text-primary data-[state=active]:font-semibold',
          // Red underline indicator
          'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
          'after:bg-transparent after:transition-colors',
          'data-[state=active]:after:bg-primary',
        ],

        // Pills: Rounded pill buttons
        variant === 'pills' && [
          'px-4 py-2 rounded-md',
          'hover:bg-accent hover:text-accent-foreground',
          'data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm',
        ],

        // Boxed: Card-style with borders
        variant === 'boxed' && [
          'px-5 py-2.5 border-r border-border last:border-r-0',
          'hover:bg-accent',
          'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        ],

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 outline-none',
        'data-[state=inactive]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsListVariant };
