'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { Bookmark, MapPin, Search, SlidersVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IJob } from '@/models/job';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { IEmployerDocument } from '@/models/employer';
import Pagination from '@/components/pagination/pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type JobWithCompanyDetails = IJob & { companyId: IEmployerDocument } & {
  _id: string;
};

const Job = ({
  job,
  isFavourite,
  toggleBookmark,
}: {
  job: JobWithCompanyDetails;
  isFavourite: boolean;
  toggleBookmark: () => void;
}) => {
  const router = useRouter();

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
            <MapPin width={18} height={18} /> {job.country}
          </p>
        </div>
        <Bookmark
          onClick={toggleBookmark}
          className={isFavourite ? styles.favourite : ''}
          height={24}
        />
      </div>
    </div>
  );
};

const FindJob = () => {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<null | JobWithCompanyDetails[]>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [favouriteJobs, setFavouriteJobs] = useState<string[]>([]);

  const limit = 10;
  const totalPages = Math.ceil(count / limit);
  const session = useSession();
  const userId = session?.data?.user?._id;

  const changePage = async (newPage: number) => {
    try {
      let page = newPage;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      const res = await axios.get(`/api/job?page=${page}&limit=${limit}`);
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

  const toggleBookmark = (id: string) => {
    if (!favouriteJobs) return;

    const isFavourite = favouriteJobs.includes(id);
    let jobs;
    if (isFavourite) {
      jobs = favouriteJobs.filter((jobId) => jobId != id);
    } else {
      jobs = [...favouriteJobs, id];
    }
    setFavouriteJobs(jobs);

    try {
      axios.patch(`/api/workers/${userId}/favouriteJobs`, jobs);
    } catch (e) {
      if (e instanceof AxiosError) {
        return toast.error(e.response?.data.message || 'An error occured');
      } else {
        console.log(e);
        return toast.error('An error occured');
      }
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `/api/job?page=${currentPage}&count=true&limit=${limit}`,
        );
        setJobs(res.data.data);
        console.log(jobs);

        setCount(res.data.total || 0);

        const workerRes = await axios.get(
          `/api/workers/${userId}/favouriteJobs`,
        );
        setFavouriteJobs(workerRes.data.data);
      } catch (e) {
        if (e instanceof AxiosError) {
          return toast.error(e.response?.data.message || 'An error occured');
        } else {
          console.log(e);
          return toast.error('An error occured');
        }
      }
    };
    if (session?.data?.user?._id) fetchJobs();
  }, [currentPage, jobs, session, userId]);

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
                isFavourite={favouriteJobs.includes(job._id)}
                toggleBookmark={() => toggleBookmark(job._id)}
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
    </div>
  );
};

export default FindJob;
