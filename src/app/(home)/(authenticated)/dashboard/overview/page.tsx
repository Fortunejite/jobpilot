'use client';
import { useSession } from 'next-auth/react';
import WorkerOverview from './WorkerOverview/WorkerOverview';
import CompanyOverview from './CompanyOverview/overview'



const Overview = () => {
  const session = useSession();
  const user = session?.data?.user
  const isWorker = user?.role === 'worker'
  if (session.status !== 'authenticated') return null

  return isWorker ? <WorkerOverview userId={user._id} /> : <CompanyOverview userId={user?._id} />
};

export default Overview;
