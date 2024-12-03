'use client';

import JobTable from '@/components/jobTable/jobTable';
import { IEmployerDocument } from '@/models/employer';
import { IJobDocument } from '@/models/job';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Overview = ({ employer }: { employer: null | IEmployerDocument }) => {
  const [jobs, setJobs] = useState<IJobDocument[] | null>(null);

  return (
    <div>
      <JobTable
        limit={10}
        footer={true}
        employer={employer}
        jobs={jobs}
        setJobs={setJobs}
      />
    </div>
  );
};

export default Overview;
