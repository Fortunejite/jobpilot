import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './jobTable.module.css'

const JobTable = ({
  limit,
  footer,
  employer,
  jobs,
  setJobs
}: {
  limit: number;
  footer: boolean;
  employer: null | IEmployerDocument;
  jobs: IJobDocument[] | null;
  setJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `/api/job?page=${page}&companyId=${employer?._id}&count=true&limit=${limit}`,
        );
        setJobs(res.data.data);
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
            const status = new Date(job.expire) > new Date() ? 'Active' : 'Expired'
            const timeRemaining = ''
            return (
            <tr>
              <td>
                <div>
                  <p><strong>{job.title}</strong></p>
                  <div>
                    <span>{job.type} . {timeRemaining}</span>
                  </div>
                </div>
              </td>
              <td>{status}</td>
              <td>{job.applicatiions?.length} Applications</td>
              <button>View Applications</button>
            </tr>
            )
          })}
        </tbody>
      </table>
    );
};

export default JobTable;
