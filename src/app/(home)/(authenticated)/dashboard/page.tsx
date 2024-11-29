import { auth } from '@/auth';
import WorkerDashboard from './workerDashboard';
import EmployerDashboard from './employerDashboard';

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;

  if (user?.role === 'worker') {
    return <WorkerDashboard />;
  } else {
    return <EmployerDashboard />;
  }
};

export default Dashboard;
