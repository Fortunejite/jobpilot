'use client';

import { AlignJustify, Bell, BriefcaseBusiness } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './navbar.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useDrawer } from '@/context/drawer';

interface Link {
  name: string;
  link: string;
  status: 'both' | 'auth' | 'no-auth';
  role: 'any' | 'worker' | 'employer';
}

const links: Link[] = [
  {
    name: 'Home',
    link: '/',
    status: 'both',
    role: 'any',
  },
  {
    name: 'Find Job',
    link: '/findJob',
    status: 'no-auth',
    role: 'any',
  },
  {
    name: 'Find Job',
    link: '/findJob',
    status: 'auth',
    role: 'worker',
  },
  {
    name: 'Find Candidates',
    link: '/findCandidates',
    status: 'auth',
    role: 'employer',
  },
  {
    name: 'Find Employers',
    link: '/findEmployers',
    status: 'auth',
    role: 'worker',
  },
  {
    name: 'Employers',
    link: '/employers',
    status: 'no-auth',
    role: 'any',
  },
  {
    name: 'Candidates',
    link: 'candidates',
    status: 'no-auth',
    role: 'any',
  },
  {
    name: 'Dashboard',
    link: '/dashboard',
    status: 'auth',
    role: 'any',
  },
  {
    name: 'My Jobs',
    link: '/myJobs',
    status: 'auth',
    role: 'employer',
  },
  {
    name: 'Applications',
    link: '/applications',
    status: 'auth',
    role: 'employer',
  },
  {
    name: 'Job Alerts',
    link: '/jobAlerts',
    status: 'auth',
    role: 'worker',
  },
  {
    name: 'Customer Support',
    link: '/support',
    status: 'both',
    role: 'any',
  },
];
const Navbar = () => {
  const [pic, setPic] = useState('');

  const authenticatedActions = [
    {
      name: 'notifications',
      icon: <Bell height={32} width={32} />,
      onClick: () => {},
    },
    {
      name: 'profile',
      icon: (
        <Image
          className={styles.avatar}
          src={pic}
          alt='Profile'
          height={32}
          width={32}
        />
      ),
      onClick: () => signOut({ redirectTo: '/login' }),
    },
  ];

  const session = useSession();
  const user = session.data?.user;
  const { toggleDrawer } = useDrawer();

  useEffect(() => {
    const getInfo = async () => {
      if (!user?._id) return;

      const url =
        user.role === 'employer'
          ? `/api/companies/${user._id}`
          : `/api/workers/${user._id}`;
      try {
        const { data } = await axios.get(url);

        const info = data.data;
        setPic(user.role === 'employer' ? info?.logo : info?.avatar);
      } catch (e) {
        console.log(e);
        return;
      }
    };
    getInfo();
  }, [user]);

  const pathname = usePathname();
  return (
    <header className={styles.container}>
      <nav className={styles.navbar}>
        <div></div>
        <ul>
          {links.map((link) => {
            if (!user && link.status === 'auth') return null;
            if (user && link.status === 'no-auth') return null;
            if (link.role !== 'any' && user?.role !== link.role) return null;
            return (
              <Link key={link.name} href={link.link}>
                <li
                  className={
                    link.link === pathname ||
                    link.link === `/${pathname.split('/')[1]}`
                      ? styles.active
                      : ''
                  }
                >
                  {link.name}
                </li>
              </Link>
            );
          })}
        </ul>
        <button className={styles.menuButton} onClick={toggleDrawer}>
          <AlignJustify />
        </button>
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
              <Link href={'/login'} className={styles.signIn}>
                Sign In
              </Link>
              <Link href={'/PostJob'} className={styles.postJob}>
                Post a Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
