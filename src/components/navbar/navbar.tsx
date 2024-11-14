'use client';

import { Bell, BriefcaseBusiness, CircleUser } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './navbar.module.css';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const links = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Find Job',
      link: '/findJob',
    },
    {
      name: 'Employers',
      link: '/employers',
    },
    {
      name: 'Candidates',
      link: 'candidates',
    },
  ];

  const authenticatedActions = [
    {
      name: 'notifications',
      icon: <Bell />,
      onClick: () => {},
    },
    {
      name: 'profile',
      icon: <CircleUser />,
      onClick: () => signOut({ redirectTo: '/login' }),
    },
  ];

  const session = useSession();
  const user = session.data?.user;

  const pathname = usePathname();
  return (
    <header className={styles.container}>
      <nav className={styles.navbar}>
        <ul>
          {links.map((link) => (
            <Link key={link.name} href={link.link}>
              <li className={link.link === pathname ? styles.active : ''}>
                {link.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <div className={styles.bottomHeader}>
        <div className={styles.logo}>
          <BriefcaseBusiness height={32} width={32} /> <h3>Jobpilot</h3>
        </div>
        <div className='serach'></div>
        <div className={styles.actions}>
          {user ? (
            <ul>
              {authenticatedActions.map((action) => (
                <li key={action.name} onClick={action.onClick}>
                  {action.icon}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.buttons}>
              <Link href={'/login'} className={styles.signIn}>Sign In</Link>
              <Link href={'/PostJob'} className={styles.postJob}>Post a Job</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
