import Navbar from '@/components/navbar/navbar';
import Drawer from '@/components/Drawer/Drawer';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Drawer />
      {children}
    </> 
  );
}
