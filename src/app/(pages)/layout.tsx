import type React from 'react';
import { TRPCReactProvider } from '~/trpc/react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
