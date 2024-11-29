import { worker } from '@/app/(home)/(authenticated)/dashboard/workerDashboard';

const appliedJobs = ({ user }: { user: null | worker }) => {
  console.log(user);
  
  return (
    <div>
      <h1>Applied Jobs</h1>
    </div>
  );
};

export default appliedJobs;
