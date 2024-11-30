import styles from './page.module.css'
import {BriefcaseBusiness} from 'lucide-react'
import Image from 'next/image'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.container}>
    <div className={styles.left}>
      <header className={styles.logo}>
        <BriefcaseBusiness height={32} width={32} /> <h2>Jobpilot</h2>
      </header>
      <main className={styles.main}>{children}</main>
        </div>
        <div className={styles.background}>
          <Image src={'/logoBackground.png'} alt='Background' fill priority/>
        </div>
    </div>;
}
