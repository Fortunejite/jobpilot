'use client';

import {
  AlignJustify,
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  Layers,
  Settings,
} from 'lucide-react';
import styles from './workerDashboard.module.css';
import AppliedJobs from '@/components/workerDashboardComponent/appliedJobs/appliedJobs';
import Overview from '@/components/workerDashboardComponent/overview/overview';
import FavouriteJobs from '@/components/workerDashboardComponent/favouriteJobs/favouriteJob';
import JobAlerts from '@/components/workerDashboardComponent/jobAlert/jobAlert';
import Setting from '@/components/workerDashboardComponent/settings/settings';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { IWorkerDocument } from '@/models/worker';
import { IUserDocument } from '@/models/user';

export type worker = IWorkerDocument  & {
  userId: IUserDocument
}

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  const tabs = [
    {
      name: 'Overview',
      icon: <Layers />,
      component: <Overview user={user} />,
    },
    {
      name: 'Applied Jobs',
      icon: <BriefcaseBusiness />,
      component: <AppliedJobs user={user} />,
    },
    {
      name: 'Favourite Jobs',
      icon: <Bookmark />,
      component: <FavouriteJobs user={user} />,
    },
    {
      name: 'Job Alerts',
      icon: <BellRing />,
      component: <JobAlerts user={user} />,
    },
    {
      name: 'Settings',
      icon: <Settings />,
      component: <Setting user={user} />,
    },
  ];

  const handleChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const session = useSession();

  useEffect(() => {
    const getUser = async () => {
      const { data } = (
        await axios.get(`/api/workers/${session?.data?.user?._id}`)
      ).data;
      setUser(data);
    };
    if (session?.data?.user?._id) getUser();
  }, [session]);

  const Drawer = () => (
    <div className={styles.drawer}>
      <div className={`${styles.drawerOverlay} ${isOpen ? styles.showOverlay : ""}`} onClick={closeDrawer}></div>
    <div className={styles.drawerContent}>
        <p>Candidate Dashboard</p>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={activeTab === index ? styles.active : ''}
              onClick={() => handleChange(index)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
  )

  return (
    <div className={styles.container}>
      <button className={styles.menu} onClick={toggleDrawer}><AlignJustify /></button>
      <Drawer />
      <aside className={styles.sideBar}>
        <p>Candidate Dashboard</p>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={activeTab === index ? styles.active : ''}
              onClick={() => handleChange(index)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </li>
          ))}
        </ul>
      </aside>
      <main>{user ? tabs[activeTab].component : <h2>Loading</h2>}</main>
    </div>
  );
};

export default WorkerDashboard;
