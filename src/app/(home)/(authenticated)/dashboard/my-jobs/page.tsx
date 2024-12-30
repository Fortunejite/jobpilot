'use client';

import JobTable from '@/components/jobTable/jobTable';
import { ICompanyDocument } from '@/models/Company';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Overview = () => {
  const [company, setCompany] = useState<null | ICompanyDocument>(null);
  const [jobCount, setJobCount] = useState(0);
  const session = useSession();
  const user = session?.data?.user;

  useEffect(() => {
    const getData = async () => {
      try {
        const companyRes = await axios.get(`/api/companies/${user?._id}`);
        const jobCountRes = await axios.get(
          `/api/stats/jobs?companyId=${companyRes.data._id}`,
        );
        setCompany(company);
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

  return (
    <div>
      <h3>{`My Jobs (${jobCount})`}</h3>
      <JobTable
        limit={10}
        pagination={true}
        companyId={company?._id as string || ''}
      />
    </div>
  );
};

export default Overview;
