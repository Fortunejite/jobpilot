import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  if (!user) return redirect('/login');
  if(user.role !== 'worker') return redirect('/home');
  return <>{children}</>;
}