'use client'

import { IEmployerDocument } from "@/models/employer";

const Overview = ({employer}: {employer: null | IEmployerDocument}) => {

  

  return (
    <div>
        <h3>Hello, {employer?.companyName}</h3>
        <span>Here is your daily activities and job alerts</span>
    </div>
)
}

export default Overview;