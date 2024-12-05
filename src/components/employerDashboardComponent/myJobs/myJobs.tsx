'use client';

import JobTable from '@/components/jobTable/jobTable';
import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import { Dispatch, SetStateAction } from 'react';

const Overview = ({
  employer,
  userId,
  currentJobs,
  setCurrentJobs,
  count,
  currentPage,
  setCurrentPage,
}: {
  employer: null | IEmployerDocument;
  userId: string;
  currentJobs: IJobDocument[] | null;
  setCurrentJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
  count: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div>
      <h3>{`My Jobs (${count})`}</h3>
      <JobTable
        limit={10}
        pagination={true}
        employer={employer}
        jobs={currentJobs}
        setJobs={setCurrentJobs}
        userId={userId}
        count={count}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Overview;
