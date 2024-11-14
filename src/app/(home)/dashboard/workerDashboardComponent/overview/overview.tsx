'use client'

import { IUserDocument } from "@/models/user";
import { useSession } from "next-auth/react";

const Overview = ({user}: {user: null | IUserDocument}) => {

  

  return (
    <div>
        <h3>Hello, {user?.fullName}</h3>
        <span>Here is your daily activities and job alerts</span>
    </div>
)
}

export default Overview;