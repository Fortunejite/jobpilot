import { worker } from '@/app/(home)/(authenticated)/dashboard/workerDashboard';

const JobAlert = ({ user }: { user: null | worker }) => {
  console.log(user);
  return (
    <div>
      <h1>Job Alert</h1>
    </div>
  );
};

export default JobAlert;
