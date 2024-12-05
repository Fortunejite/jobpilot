'use client';

import {
  AlignJustify,
  Bookmark,
  BriefcaseBusiness,
  CirclePlus,
  CircleUserRound,
  Layers,
  List,
  Settings,
  X,
} from 'lucide-react';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { IEmployerDocument } from '@/models/employer';
import Overview from '@/components/employerDashboardComponent/overview/overview';
import PostJob from '@/components/employerDashboardComponent/postJob/postJob';
import { useRouter } from 'next/navigation';
import MyJobs from '@/components/employerDashboardComponent/myJobs/myJobs';
import { IJobDocument } from '@/models/job';

const EmployerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [count, setCount] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [employer, setEmployer] = useState<IEmployerDocument | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentJobs, setCurrentJobs] = useState<IJobDocument[] | null>(null);
  const [recentJobs, setRecentJobs] = useState<IJobDocument[] | null>(null);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);
  const session = useSession();
  const userId = session?.data?.user?._id;

  const tabs = [
    {
      name: 'Overview',
      icon: <Layers />,
      component: (
        <Overview
          employer={employer}
          userId={userId || ''}
          recentJobs={recentJobs}
          setRecentJobs={setRecentJobs}
          openJobs={openJobs}
          setCount={setCount}
          switchTabs={() => handleChange(3)}
        />
      ),
    },
    {
      name: 'Employers Profile',
      icon: <CircleUserRound />,
      component: null,
    },
    {
      name: 'Post a Job',
      icon: <CirclePlus />,
      component: (
        <PostJob
          setCount={setCount}
          switchTabs={() => handleChange(3)}
          setRecentJobs={setRecentJobs}
        />
      ),
    },
    {
      name: 'My Jobs',
      icon: <BriefcaseBusiness />,
      component: (
        <MyJobs
          employer={employer}
          userId={userId || ''}
          currentJobs={currentJobs}
          setCurrentJobs={setCurrentJobs}
          count={count}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ),
    },
    {
      name: 'Saved Candidates',
      icon: <Bookmark />,
      component: null,
    },
    {
      name: 'Plans & Billing',
      icon: <List />,
      component: null,
    },
    {
      name: 'All Companies',
      icon: <List />,
      component: null,
    },
    {
      name: 'Settings',
      icon: <Settings />,
      component: null,
    },
  ];

  const handleChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    const getEmployer = async () => {
      try {
        if (!userId || userId === '') return;
        const { data } = await axios.get(`/api/employer/${userId}`);
        const employer = data.data as IEmployerDocument;
        setEmployer(employer);
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.status === 404) return router.push('/welcome');
        }
      }
    };
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `/api/job?page=${currentPage}userId=${userId}&count=true&limit=${10}`,
        );
        setCurrentJobs(res.data.data);
        setRecentJobs(res.data.data);
        const overview = await axios.get(`/api/job/overview?userId=${userId}`);
        setCount(overview.data.total || 0);
        setOpenJobs(overview.data.openJobs);
      } catch (e) {
        console.log(e);
      }
    };
    if (session?.data?.user?._id) {
      getEmployer();
      fetchJobs();
    }
  }, [session]);

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
        <p>Employer Dashboard</p>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={activeTab === index ? styles.active : ''}
              onClick={() => {
                closeDrawer();
                handleChange(index);
              }}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.menu} onClick={toggleDrawer}>
        <AlignJustify />
      </button>
      <Drawer />
      <aside className={styles.sideBar}>
        <p>Employer Dashboard</p>
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
      <main>{employer ? tabs[activeTab].component : <h2>Loading</h2>}</main>
    </div>
  );
};

export default EmployerDashboard;
