"use client";

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/components/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
Label.displayName = LabelPrimitive.Root.displayName!;

export { Label };
