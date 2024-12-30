'use client';
import { useSession } from 'next-auth/react';
import WorkerSettings from './workerSettings/settings';
import CompanySettings from './companySettings/settings'



const Settings = () => {
  const session = useSession();
  const user = session?.data?.user
  const isWorker = user?.role === 'worker'
  if (session.status !== 'authenticated') return null

  return isWorker ? <WorkerSettings userId={user._id} /> : <CompanySettings userId={user?._id as string} />
};

export default Settings;
