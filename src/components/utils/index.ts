import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const classNames = (...classes: (string | unknown)[]) => {
  return classes.filter(Boolean).join(' ');
};
