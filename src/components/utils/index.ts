import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const classNames = (...classes: (string | unknown)[]) => {
  return classes.filter(Boolean).join(" ");
};
