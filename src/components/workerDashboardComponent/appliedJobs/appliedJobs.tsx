import { IUserDocument } from "@/models/user"
import { worker } from "@/app/(home)/dashboard/workerDashboard"

const appliedJobs = ({user}: {user: null | worker}) => {return (
  <div>
      <h1>Applied Jobs</h1>
  </div>
)}

export default appliedJobs