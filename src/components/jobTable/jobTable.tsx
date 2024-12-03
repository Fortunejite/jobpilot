import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './jobTable.module.css';
import { CircleCheck, CircleX, UsersRound } from 'lucide-react';

const JobTable = ({
  limit,
  footer,
  jobs,
  setJobs,
  userId,
  setCount,
}: {
  limit: number;
  footer: boolean;
  employer: null | IEmployerDocument;
  jobs: IJobDocument[] | null;
  setJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
  userId: string;
  setCount: Dispatch<SetStateAction<number>>;
}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `/api/job?page=${page}&userId=${userId}&count=true&limit=${limit}`,
        );
        setJobs(res.data.data);
        setCount(res.data.total || 0);
        console.log(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchJobs();
  }, []);

  if (jobs && jobs.length > 0)
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>JOBS</th>
            <th>STATUS</th>
            <th>APPLICATIONS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const status =
              new Date(job.expire) > new Date() ? 'Active' : 'Expired';
            const icon = status === 'Active' ? <CircleCheck /> : <CircleX />;
            const timeRemaining = '';
            return (
              <tr>
                <td>
                  <div>
                    <p>
                      <strong>{job.title}</strong>
                    </p>
                    <div>
                      <span>
                        {job.type} . {timeRemaining}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className={
                    status === 'Active'
                      ? styles.activeStatus
                      : styles.expiredStatus
                  }
                >
                  {icon}
                  <span>{status}</span>
                </td>
                <td>
                  {' '}
                  <UsersRound />{' '}
                  <span>{job.applicatiions?.length} Applications</span>
                </td>
                <td>
                  <button>View Applications</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
};

export default JobTable;
