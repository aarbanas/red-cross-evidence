import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import type React from 'react';

export const metadata = {
  title: 'Crveni Križ Evidencija',
  description: 'Aplikacija za vođenje evidencije Crvenog Križa',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
