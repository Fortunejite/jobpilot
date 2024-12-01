'use client';

import { IEmployerDocument } from '@/models/employer';
import { IJob } from '@/models/job';
import { ChangeEvent, useState } from 'react';
import styles from './postJob.module.css';

const PostJob = ({ employer }: { employer: null | IEmployerDocument }) => {
  const [formData, setFormData] = useState<IJob>({
    title: '',
    tags: [],
    role: '',
    minSalary: 0,
    maxSalary: 0,
    salaryType: 'Hourly',
    education: '',
    exprience: '',
    jobType: 'FreeLance',
    vacancies: 0,
    expire: new Date(),
    country: '',
    benefits: [],
    description: '',
    applyOn: 'jobPilot',
    skills: [],
  });

  const handleSubmit = () => {
    console.log(formData);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  return (
    <div>
      <h3>Post a job</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.entry}>
          <label htmlFor='title'>Job Title</label>
          <input id='title' value={formData.title} onChange={handleChange} />
        </div>
        <div className={styles.entry}>
          <label htmlFor='title'>Job Title</label>
          <input id='title' value={formData.title} onChange={handleChange} />
        </div>
        <div className={styles.entry}>
          <label htmlFor='role'>Job Role</label>
          <input id='role' value={formData.role} onChange={handleChange} />
        </div>
        <div className={styles.entry}>
          <label htmlFor='minSalary'>Min Salary</label>
          <input id='minSalary' type='number' value={formData.minSalary} onChange={handleChange} />
        </div>
        <div className={styles.entry}>
          <label htmlFor='maxSalary'>Max Salary</label>
          <input id='maxSalary' type='number' value={formData.maxSalary} onChange={handleChange} />
        </div>
      </form>
    </div>
  );
};

export default PostJob;
