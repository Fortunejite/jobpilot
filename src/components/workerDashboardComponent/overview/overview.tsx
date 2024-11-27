'use client'

import { IUserDocument } from "@/models/user";
import { useSession } from "next-auth/react";
import { worker } from "@/app/(home)/dashboard/workerDashboard";

const Overview = ({user}: {user: null | worker}) => {

  

  return (
    <div>
        <h3>Hello, {user?.userId.fullName}</h3>
        <span>Here is your daily activities and job alerts</span>
    </div>
)
}

export default Overview;