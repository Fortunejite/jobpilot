'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { Bookmark, MapPin, Search, SlidersVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Pagination from '@/components/pagination/pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Footer from '@/components/DarkFooter/page';
import { JobWithCompanyInfo, SavedJobWithJobInfo } from '@/components/types';

const Job = ({
  job,
  defaultIsFavourite,
}: {
  job: JobWithCompanyInfo;
  defaultIsFavourite: boolean;
}) => {
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(defaultIsFavourite);
  
  const toggleBookmark = (id: string) => {

    setIsFavourite(prev => !prev)

    try {
      if (isFavourite) axios.delete(`/api/saved-jobs/${id}`);
      else axios.post('/api/saved-jobs/', { jobId: id });
    } catch (e) {
      if (e instanceof AxiosError) {
        return toast.error(e.response?.data.message || 'An error occured');
      } else {
        console.log(e);
        return toast.error('An error occured');
      }
    }
  };

  const handleJobClick = () => {
    router.push(`/findJob/${job._id}`);
  };

  return (
    <div className={styles.job}>
      <h3 onClick={handleJobClick}>{job.title}</h3>
      <div className={styles.details} onClick={handleJobClick}>
        <span className={styles.type}>{job.type}</span>
        <span className={styles.salary}>
          {`Salary: $${job.minSalary} - $${job.maxSalary}`}
        </span>
      </div>
      <div className={styles.company}>
        <div className={styles.logo}>
          <Image src={job.companyId.logo} alt='logo' fill />
        </div>
        <div className={styles.info}>
          <p className={styles.companyName}>{job.companyId.companyName}</p>
          <p>
            <MapPin width={18} height={18} /> {job.locationA}
          </p>
        </div>
        <Bookmark
          onClick={() => toggleBookmark(job._id)}
          className={isFavourite ? styles.favourite : ''}
          height={24}
        />
      </div>
    </div>
  );
};

const FindJob = () => {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<null | JobWithCompanyInfo[]>(null);
  const [favouriteJobs, setFavouriteJobs] = useState<SavedJobWithJobInfo[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(count / limit);

  const changePage = async (newPage: number) => {
    try {
      let page = newPage;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      const res = await axios.get(`/api/jobs?page=${page}&limit=${limit}`);
      console.log(res.data);

      setJobs(res.data.data);
      setCurrentPage(page);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status === 404) {
          setJobs([]);
          return;
        }
      }
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobPromise = axios.get(
          `/api/jobs?page=${currentPage}&limit=${limit}`,
        );
        const jobCountPromise = axios.get(`/api/stats/`);

        const [jobRes, jobCountRes] = await Promise.all([
          jobPromise,
          jobCountPromise,
        ]);

        setJobs(jobRes.data);
        setCount(jobCountRes.data.jobcount);
        const savedJobsRes = await axios.get(`/api/saved-jobs`);
        setFavouriteJobs(savedJobsRes.data);
      } catch (e) {
        if (e instanceof AxiosError) {
          return toast.error(e.response?.data.message || 'An error occured');
        } else {
          console.log(e);
          return toast.error('An error occured');
        }
      }
    };
    fetchJobs();
  }, []);

  if (!favouriteJobs || !jobs) return null

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <span>Find Job</span>
        <div>
          <Link href={'/'}>Home</Link>
          <span>{'\t/\tFind job'}</span>
        </div>
      </div>
      <main>
        <div className={styles.search}>
          <div className={styles.searchBar}>
            <Search />
            <input
              type='text'
              placeholder='Search by: Job title, Position, Keyword'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <button>
              <SlidersVertical height={18} width={18} />
              <span>Filters</span>
            </button>
            <button className={styles.primaryBtn}>
              <span>Find Jobs</span>
            </button>
          </div>
        </div>
        {jobs && (
          <div className={styles.jobs}>
            {jobs.map((job, index) => (
              <Job
                key={index}
                job={job}
                defaultIsFavourite={(favouriteJobs.filter(favouriteJob => favouriteJob.jobId._id === job._id)).length > 0}
              />
            ))}
          </div>
        )}
      </main>
      {jobs && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          changePage={changePage}
        />
      )}
      <Footer />
    </div>
  );
};

export default FindJob;
