import type { VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/components/utils';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

type PaginationProps = {
  totalPageNumber: number;
  currentPage: number;
  onChangePage(page: number): void;
  onPreviousPage(): void;
  onNextPage(): void;
};

const DELTA = 2;
const ELLIPSIS_JUMP = 5;

const PaginationPages: React.FC<PaginationProps> = ({
  totalPageNumber,
  currentPage,
  onChangePage,
  onPreviousPage,
  onNextPage,
}) => {
  const windowStart = Math.max(2, currentPage - DELTA);
  const windowEnd = Math.min(totalPageNumber - 1, currentPage + DELTA);
  const windowPages: number[] = [];

  for (let i = windowStart; i <= windowEnd; i++) {
    windowPages.push(i);
  }

  const showLeftEllipsis = windowStart > 2;
  const showRightEllipsis = windowEnd < totalPageNumber - 1;

  return (
    <>
      <PaginationItem onClick={() => onPreviousPage()}>
        <PaginationPrevious />
      </PaginationItem>

      <PaginationItem onClick={() => onChangePage(0)}>
        <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
      </PaginationItem>

      {showLeftEllipsis && (
        <PaginationItem
          onClick={() =>
            onChangePage(Math.max(1, currentPage - ELLIPSIS_JUMP) - 1)
          }
        >
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {windowPages.map((num) => (
        <PaginationItem key={num} onClick={() => onChangePage(num - 1)}>
          <PaginationLink isActive={currentPage === num}>{num}</PaginationLink>
        </PaginationItem>
      ))}

      {showRightEllipsis && (
        <PaginationItem
          onClick={() =>
            onChangePage(
              Math.min(totalPageNumber, currentPage + ELLIPSIS_JUMP) - 1,
            )
          }
        >
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {totalPageNumber > 1 && (
        <PaginationItem onClick={() => onChangePage(totalPageNumber - 1)}>
          <PaginationLink isActive={currentPage === totalPageNumber}>
            {totalPageNumber}
          </PaginationLink>
        </PaginationItem>
      )}

      <PaginationItem onClick={() => onNextPage()}>
        <PaginationNext />
      </PaginationItem>
    </>
  );
};

PaginationPages.displayName = 'PaginationPages';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
    style={{ cursor: 'pointer' }}
  />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  size?: VariantProps<typeof buttonVariants>['size'];
} & React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'default' : 'outline',
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn(className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn(className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
};
