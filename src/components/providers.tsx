'use client';

import { SessionProvider } from 'next-auth/react';
const Proividers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Proividers;
