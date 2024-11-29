'use client'

import { worker } from "@/app/(home)/(authenticated)/dashboard/workerDashboard";

const Overview = ({user}: {user: null | worker}) => {

  console.log(user);

  return (
    <div>
        <h3>Hello, </h3>
        <span>Here is your daily activities and job alerts</span>
    </div>
)
}

export default Overview;