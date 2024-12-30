'use client'

import { Layers, BriefcaseBusiness, Bookmark, BellRing, Settings, X, AlignJustify, CirclePlus, CircleUserRound, List } from 'lucide-react';
import styles from './dashboard.module.css';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  name: string;
  icon: JSX.Element;
  link: string;
}

const WorkerTabs = [
  {
    name: 'Overview',
    icon: <Layers />,
    link: '/dashboard/overview',
  },
  {
    name: 'Applied Jobs',
    icon: <BriefcaseBusiness />,
    link: '/dashboard/applied-jobs',
  },
  {
    name: 'Favourite Jobs',
    icon: <Bookmark />,
    link: '/dashboard/favourite-jobs',
  },
  {
    name: 'Job Alerts',
    icon: <BellRing />,
    link: '/dashboard/job-alerts',
  },
  {
    name: 'Settings',
    icon: <Settings />,
    link: '/dashboard/settings',
  },
];

const CompanyTabs = [
  {
    name: 'Overview',
    icon: <Layers />,
    link: '/dashboard/overview',
  },
  {
    name: 'Employers Profile',
    icon: <CircleUserRound />,
    link: '/dashboard',
  },
  {
    name: 'Post a Job',
    icon: <CirclePlus />,
    link: '/dashboard/post-job',
  },
  {
    name: 'My Jobs',
    icon: <BriefcaseBusiness />,
    link: '/dashboard/my-jobs',
  },
  {
    name: 'Saved Candidates',
    icon: <Bookmark />,
    link: '/dashboard',
  },
  {
    name: 'Plans & Billing',
    icon: <List />,
    link: '/dashboard',
  },
  {
    name: 'All Companies',
    icon: <List />,
    link: '/dashboard',
  },
  {
    name: 'Settings',
    icon: <Settings />,
    link: '/dashboard/settings',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  const pathname = usePathname()

  const session = useSession();
  const user = session?.data?.user;

  const isCompany = user?.role === 'employer'

  const tabs = isCompany ? CompanyTabs : WorkerTabs as Tab[]

  const activeTab = `/dashboard/${pathname.split('/').pop()}`

  const Drawer = () => (
    <div>
      <div
        className={`${styles.drawerOverlay} ${
          isOpen ? styles.showOverlay : ''
        }`}
        onClick={closeDrawer}
      ></div>
  
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={closeDrawer}>
          <X />
        </button>
        <p>Candidate Dashboard</p>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => (
            <li
            key={index}
            className={tab.link === activeTab ? styles.active : ''}
          >
            <Link href={tab.link}>
            {tab.icon}
            <span>{tab.name}</span>
            </Link>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return <div className={styles.container}>
      <button className={styles.menu} onClick={toggleDrawer}>
        <AlignJustify />
      </button>
      <Drawer />
      <aside className={styles.sideBar}>
        <p>{isCompany ? 'Company Dashboard' : 'Candidate Dashboard'}</p>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={tab.link === activeTab ? styles.active : ''}
            >
              <Link href={tab.link}>
              {tab.icon}
              <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>{user ? (children) : <h2>Loading</h2>}</main>
    </div>
}
