import { CircleUserRound, Globe, UserRound, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './settings.module.css';
import Personal from './personal/personal';
import Profile from './profile/profile';
import Socials from './socials/socials';
import Account from './account/account';
import { WorkerWithUserInfo } from '@/components/types';
import axios from 'axios';

const SettingsPage = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<null | WorkerWithUserInfo>(null)
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const { data: userData } = await axios.get(`/api/workers/${userId}`);
      setUser(userData);
    };
    getData();
  }, []);
  
  const handleChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };
  const tabs = [
    {
      name: 'Personal',
      icon: <UserRound />,
      component: <Personal user={user} />,
    },
    {
      name: 'Profile',
      icon: <CircleUserRound />,
      component: <Profile user={user} />,
    },
    {
      name: 'Social Links',
      icon: <Globe />,
      component: <Socials user={user} />,
    },
    {
      name: 'Account Setting',
      icon: <Settings />,
      component: <Account />,
    },
  ];
  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <ul className={styles.tabs}>
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={activeTab === index ? styles.active : ''}
            onClick={() => handleChange(index)}
          >
            {tab.icon} <span>{tab.name}</span>
          </li>
        ))}
      </ul>
      <main>{user ? tabs[activeTab].component : <h2>Loading</h2>}</main>
    </div>
  );
};

export default SettingsPage;
