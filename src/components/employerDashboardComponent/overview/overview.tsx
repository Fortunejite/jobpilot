'use client';

import { IEmployerDocument } from '@/models/employer';
import styles from './overview.module.css';
import JobTable from '@/components/jobTable/jobTable';
import { IJobDocument } from '@/models/job';
import { Dispatch, SetStateAction } from 'react';
import { ArrowRight, BriefcaseBusiness, IdCard } from 'lucide-react';

interface OverviewProps {
  employer: null | IEmployerDocument;
  userId: string;
  recentJobs: IJobDocument[] | null;
  setRecentJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
  openJobs: number;
  setCount: Dispatch<SetStateAction<number>>;
  switchTabs: () => void;
}

const Overview = ({
  employer,
  userId,
  recentJobs,
  setRecentJobs,
  openJobs,
  setCount,
  switchTabs,
}: OverviewProps) => {
  const handleSwitchTabs = () => {
    switchTabs();
  };

  return (
    <div className={styles.container}>
      <div className={styles.greeting}>
        <h3>Hello, {employer?.companyName}</h3>
        <span>Here is your daily activities and job alerts</span>
      </div>
      <div className={styles.summary}>
        <div className={styles.openJobs}>
          <div className={styles.content}>
            <h2>{openJobs}</h2>
            <p>Open Jobs</p>
          </div>
          <div className={styles.icon}>
            <BriefcaseBusiness />
          </div>
        </div>
        <div className={styles.savedCanidate}>
          <div className={styles.content}>
            <h2>{employer?.savedCandidate?.length || 0}</h2>
            <p>Saved Candidate</p>
          </div>
          <div className={styles.icon}>
            <IdCard />
          </div>
        </div>
      </div>
      <div>
        {recentJobs && (
          <>
            <div className={styles.view}>
              <h3>Recently Posted Jobs</h3>
              <button onClick={handleSwitchTabs}>
                <span>View All</span> <ArrowRight />
              </button>
            </div>
            <JobTable
              limit={5}
              pagination={false}
              employer={employer}
              jobs={recentJobs}
              setJobs={setRecentJobs}
              userId={userId}
              currentPage={0}
              setCurrentPage={setCount}
              count={0}
            />{' '}
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
