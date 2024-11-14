'use client'

import { BellRing, Bookmark, BriefcaseBusiness, Layers, Settings } from 'lucide-react';
import styles from './workerDashboard.module.css';
import AppliedJobs from './workerDashboardComponent/appliedJobs/appliedJobs';
import Overview from './workerDashboardComponent/overview/overview';
import FavouriteJobs from './workerDashboardComponent/favouriteJobs/favouriteJob';
import JobAlerts from './workerDashboardComponent/jobAlert/jobAlert';
import Setting from './workerDashboardComponent/settings/settings';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const WorkerDashboard = () => {

const [activeTab, setActiveTab] = useState(0);
const [user, setUser] = useState(null);

const tabs = [{
  name: 'Overview',
  icon: <Layers />,
  component: <Overview user={user}/>,
},
{
  name: 'Applied Jobs',
  icon: <BriefcaseBusiness />,
  component: <AppliedJobs user={user}/>,
},
{
  name: 'Favourite Jobs',
  icon: <Bookmark />,
  component: <FavouriteJobs user={user}/>,
},
{
  name: 'Job Alerts',
  icon: <BellRing />,
  component: <JobAlerts user={user}/>,
},
{
  name: 'Settings',
  icon: <Settings />,
  component: <Setting user={user}/>,
}
]

const handleChange = (tabIndex: number) => {
  setActiveTab(tabIndex);
}

const session = useSession();

useEffect(() => {
  const getUser = async () => {
    const data = await axios.get(`/api/user/${session?.data?.user?._id}`)
    const user = data.data.data;
    setUser(user);
  }
  if (session?.data?.user?._id) getUser();
}, [session])

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
        {user ? tabs[activeTab].component : <h2>Loading</h2>}
      </main>
    </div>
  );
}

export default WorkerDashboard;