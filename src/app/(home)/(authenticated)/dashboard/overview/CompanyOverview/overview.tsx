'use client';

import { ICompanyDocument } from '@/models/Company';
import styles from './overview.module.css';
import JobTable from '@/components/jobTable/jobTable';
import { IJobDocument } from '@/models/Job';
import { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, IdCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface OverviewProps {
  userId: string;
}

const Overview = ({ userId }: OverviewProps) => {
  const [company, setCompany] = useState<null | ICompanyDocument>(null);
  const [recentJobs, setRecentJobs] = useState<IJobDocument[] | null>(null);
  const [stats, setStats] = useState({
    openJobs: 0,
    savedCanidate: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const companyPromise = axios.get(`/api/companies/${userId}`);
        const jobPromise = axios.get(`/api/jobs?userId=${userId}&limit=${5}`);
        const openJobsPromise = axios.get('/api/stats/jobs?status=open');
        const savedCanidatesPromise = axios.get('/api/stats/saved-workers');

        const [companyRes, jobRes, openJobs, savedCanidate] = await Promise.all(
          [companyPromise, jobPromise, openJobsPromise, savedCanidatesPromise],
        );
        const company = companyRes.data;
        const jobs = jobRes.data;
        setCompany(company);
        setRecentJobs(jobs);
        setStats({
          openJobs: openJobs.data.count,
          savedCanidate: savedCanidate.data.count,
        });
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.status === 404) return router.push('/welcome');
          else {
            toast.error(e.response?.data.message);
            console.log(e);
          }
        } else {
          toast.error('An error occured');
          console.log(e);
        }
      }
    };
    getData();
  }, []);

  if (!company) return null;

  return (
    <div className={styles.container}>
      <div className={styles.greeting}>
        <h3>Hello, {company?.companyName}</h3>
        <span>Here is your daily activities and job alerts</span>
      </div>
      <div className={styles.summary}>
        <div className={styles.openJobs}>
          <div className={styles.content}>
            <h2>{stats.openJobs}</h2>
            <p>Open Jobs</p>
          </div>
          <div className={styles.icon}>
            <BriefcaseBusiness />
          </div>
        </div>
        <div className={styles.savedCanidate}>
          <div className={styles.content}>
            <h2>{stats.savedCanidate}</h2>
            <p>Saved Candidate</p>
          </div>
          <div className={styles.icon}>
            <IdCard />
          </div>
        </div>
      </div>
      <div>
        {recentJobs && recentJobs.length > 0 && (
          <>
            <div className={styles.view}>
              <h3>Recently Posted Jobs</h3>
              <Link href={'/my-jobs'}>
                <span>View All</span> <ArrowRight />
              </Link>
            </div>
            <JobTable
              limit={5}
              pagination={false}
              companyId={company._id as string}
            />{' '}
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
