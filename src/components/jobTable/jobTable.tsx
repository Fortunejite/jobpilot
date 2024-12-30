import { IJobDocument } from '@/models/Job';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import styles from './jobTable.module.css';
import {
  CircleCheck,
  CirclePlus,
  CircleX,
  EllipsisVertical,
  Eye,
  UsersRound,
} from 'lucide-react';
import Pagination from '../pagination/pagination';
import { toast } from 'react-toastify';
import { formatDate, getRemainingDays } from '@/lib/dates';

interface Props {
  limit: number;
  pagination: boolean;
  companyId: string;
}

type JobWithApplicationInfo = IJobDocument & {
  applications: number;
};

const DropDown = ({
  isOpen,
  toggleDropdown,
}: {
  isOpen: boolean;
  toggleDropdown: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDropdown();
  };

  return (
    <div onClick={handleClick} className={styles.dropdown}>
      <button className={styles.dropdownToggle}>
        <EllipsisVertical />
      </button>
      {isOpen && (
        <ul className={`${styles.dropdownMenu}`}>
          <li>
            <CirclePlus /> Promote Job
          </li>
          <li>
            <Eye /> View Details
          </li>
          <li>
            <CircleX /> Make expire
          </li>
        </ul>
      )}
    </div>
  );
};

const JobTable = ({ limit, pagination, companyId }: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<null | number>(null);

  const [jobCount, setJobCount] = useState(0);
  const [jobs, setJobs] = useState<
    JobWithApplicationInfo[] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobCount / limit);

  useEffect(() => {
    const getData = async () => {
      try {
        const jobPromise = axios.get(`/api/jobs?companyId=${companyId}`);
        const jobCountPromise = axios.get(
          `/api/stats/jobs?companyId=${companyId}`,
        );

        const [jobRes, jobCountRes] = await Promise.all([
          jobPromise,
          jobCountPromise,
        ]);
        const updatedJobs = await Promise.all(
          jobRes.data.map(async (job: JobWithApplicationInfo) => {
            const { data } = await axios.get(
              `/api/stats/applications/${job._id}`,
            );
            job.applications = data.count;
            return job;
          }),
        );
        setJobs(updatedJobs);
        setJobCount(jobCountRes.data.count);
      } catch (e) {
        if (e instanceof AxiosError) {
          toast.error(e.response?.data.message);
          console.log(e);
        } else {
          toast.error('An error occured');
          console.log(e);
        }
      }
    };
    getData();
  }, []);

  const changePage = async (newPage: number) => {
    try {
      let page = newPage;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      const res = await axios.get(
        `/api/jobs?page=${page}&companyId=${companyId}&limit=${limit}`,
      );
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
  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  if (jobs && jobs.length > 0)
    return (
      <div>
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
            {jobs.map((job, index) => {
              if (index >= limit) return null;
              const date = new Date(job.expire);
              const status = date >= new Date() ? 'Active' : 'Expired';
              const icon = status === 'Active' ? <CircleCheck /> : <CircleX />;
              const timeRemaining =
                status === 'Active'
                  ? `${getRemainingDays(date)} days remaining`
                  : formatDate(date);

              return (
                <tr key={index}>
                  <td>
                    <div className={styles.jobs}>
                      <p>
                        <strong>{job.title}</strong>
                      </p>
                      <div>
                        <span>
                          {job.type} • {timeRemaining}
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
                    <UsersRound /> <span>{job.applications} Applications</span>
                  </td>
                  <td className={styles.actions}>
                    <button>View Applications</button>
                    <DropDown
                      isOpen={openDropdownId === index}
                      toggleDropdown={() => toggleDropdown(index)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={changePage}
          />
        )}
      </div>
    );
};

export default JobTable;
