import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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

interface Props {
  limit: number;
  pagination: boolean;
  employer: null | IEmployerDocument;
  jobs: IJobDocument[] | null;
  setJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
  userId: string;
  count: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

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

const JobTable = ({
  limit,
  pagination,
  jobs,
  setJobs,
  userId,
  count,
  currentPage,
  setCurrentPage,
}: Props) => {
  const totalPages = Math.ceil(count / limit);
  const [openDropdownId, setOpenDropdownId] = useState<null | number>(null);

  const changePage = async (newPage: number) => {
    try {
      let page = newPage;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      const res = await axios.get(
        `/api/job?page=${page}&userId=${userId}&limit=${limit}`,
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

  const getRemainingDays = (date: Date) => {
    const currentDate = new Date();
    const timeDifference = date.getTime() - currentDate.getTime();

    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
