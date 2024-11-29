'use client'

import { Bookmark, BriefcaseBusiness, CirclePlus, CircleUserRound, Layers, List, Settings } from 'lucide-react';
import styles from './workerDashboard.module.css';
import AppliedJobs from '../../../../components/workerDashboardComponent/appliedJobs/appliedJobs';
import Overview from '../../../../components/workerDashboardComponent/overview/overview';
import FavouriteJobs from '../../../../components/workerDashboardComponent/favouriteJobs/favouriteJob';
import JobAlerts from '../../../../components/workerDashboardComponent/jobAlert/jobAlert';
import Setting from '../../../../components/workerDashboardComponent/settings/settings';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
const [user, setUser] = useState(null);

const tabs = [{
  name: 'Overview',
  icon: <Layers />,
  component: <Overview user={user}/>,
},
{
  name: 'Employers Profile',
  icon: <CircleUserRound />,
  component: <AppliedJobs user={user}/>,
},
{
  name: 'Post a Job',
  icon: <CirclePlus />,
  component: <FavouriteJobs user={user}/>,
},
{
  name: 'My Jobs',
  icon: <BriefcaseBusiness />,
  component: <JobAlerts user={user}/>,
},
{
  name: 'Saved Candidates',
  icon: <Bookmark />,
  component: <Setting user={user}/>,
},
{
  name: 'Plans & Billing',
  icon: <List />,
  component: <Setting user={user}/>,
},
{
  name: 'All Companies',
  icon: <List />,
  component: <Setting user={user}/>,
},
{
  name: 'Settings',
  icon: <Settings />,
  component: <Setting user={user}/>,
},
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
    )
}

export default EmployerDashboard;