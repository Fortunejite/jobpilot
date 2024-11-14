'use client'

import { BellRing, Bookmark, BriefcaseBusiness, Layers, Settings } from 'lucide-react';
import styles from './workerDashboard.module.css';
import AppliedJobs from './workerDashboardComponent/appliedJobs/appliedJobs';
import Overview from './workerDashboardComponent/overview/overview';
import FavouriteJobs from './workerDashboardComponent/favouriteJobs/favouriteJob';
import JobAlerts from './workerDashboardComponent/jobAlert/jobAlert';
import Setting from './workerDashboardComponent/settings/settings';
import { useState } from 'react';

const WorkerDashboard = () => {
  const tabs = [{
    name: 'Overview',
    icon: <Layers />,
    component: <Overview />,
  },
  {
    name: 'Applied Jobs',
    icon: <BriefcaseBusiness />,
    component: <AppliedJobs />,
  },
  {
    name: 'Favourite Jobs',
    icon: <Bookmark />,
    component: <FavouriteJobs />,
  },
  {
    name: 'Job Alerts',
    icon: <BellRing />,
    component: <JobAlerts />,
  },
  {
    name: 'Settings',
    icon: <Settings />,
    component: <Setting />,
  }
]

const [activeTab, setActiveTab] = useState(0);

const handleChange = (tabIndex: number) => {
  setActiveTab(tabIndex);
}

  return (
    <div className={styles.container}>
      <aside className={styles.sideBar}>
        <p>Candidate Dashboard</p>
        <ul className={styles.tabs}>
        {
          tabs.map((tab, index) => (
            <li key={index} className={activeTab === index ? styles.active : '' } onClick={() => handleChange(index)}>
              {tab.icon}
              <span>{tab.name}</span>
            </li>
        ))}
        </ul>
      </aside>
      <main>
        {tabs[activeTab].component}
      </main>
    </div>
  );
}

export default WorkerDashboard;