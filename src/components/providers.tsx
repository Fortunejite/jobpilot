'use client';

import { SessionProvider } from 'next-auth/react';
import { DrawerProvider } from '@/context/drawer';
const Proividers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SessionProvider>
    <DrawerProvider>{children}</DrawerProvider></SessionProvider>;
};

export default Proividers;
