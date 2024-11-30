import styles from './page.module.css'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.container}>
    <div className={styles.left}>
      <header className={styles.logo}>
        <BriefcaseBusiness height={32} width={32} /> <h1>Jobpilot</h1>
      </header>
      <main className={styles.main}>{children}</main>
        </div>
        <div className={styles.background}>
          <Image src={'/logoBackground.png'} alt='Background' fill priority/>
        </div>
    </div>;
}
