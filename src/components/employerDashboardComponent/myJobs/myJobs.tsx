'use client';

import JobTable from '@/components/jobTable/jobTable';
import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Overview = ({ employer, userId }: { employer: null | IEmployerDocument, userId: string }) => {
  const [jobs, setJobs] = useState<IJobDocument[] | null>(null);
  const [count, setCount] = useState(0)

  return (
    <div>
      <h3>{`My Jobs (${count})`}</h3>
      <JobTable
        limit={10}
        footer={true}
        employer={employer}
        jobs={jobs}
        setJobs={setJobs}
        userId={userId}
        setCount={setCount}
      />
    </div>
  );
};

export default Overview;
