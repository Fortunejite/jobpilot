import { WorkerWithUserInfo } from '@/components/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './overview.module.css';
import { Bookmark, BriefcaseBusiness } from 'lucide-react';

const WorkerOverview = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<WorkerWithUserInfo | null>(null);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    favouriteJob: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const { data: userData } = await axios.get(`/api/workers/${userId}`);
      setUser(userData);
      const applicationsPromise = axios.get('/api/stats/applications');
      const savedJobsPromise = axios.get('/api/stats/saved-jobs');
      const [applicatiions, savedJobs] = await Promise.all([
        applicationsPromise,
        savedJobsPromise,
      ]);
      setStats({
        appliedJobs: applicatiions.data.count,
        favouriteJob: savedJobs.data.count,
      });
    };
    getData();
  }, []);

  if (!user) return null;
  return (
    <div>
      <h3>Hello, {user?.userId?.fullName}</h3>
      <span>Here is your daily activities and job alerts</span>
      <div className={styles.stats}>
        <div className={styles.applied}>
          <div className={styles.content}>
            <h2>{stats.appliedJobs}</h2>
            <p>Applied Jobs</p>
          </div>
          <div className={styles.icon}>
            <BriefcaseBusiness />
          </div>
        </div>
        <div className={styles.savedJobs}>
          <div className={styles.content}>
            <h2>{stats.favouriteJob}</h2>
            <p>Favourite Job</p>
          </div>
          <div className={styles.icon}>
            <Bookmark />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerOverview;
