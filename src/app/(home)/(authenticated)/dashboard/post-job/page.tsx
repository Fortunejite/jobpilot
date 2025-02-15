'use client';

import { IJob } from '@/models/Job';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './page.module.css';
import TagInput from '@/components/tagInput/tagInput';
import { benefits, salaryType, tagsList, type } from '@/lib/data/jobInfo';
import { educations, exprience } from '@/lib/data/workerInfo';
import { ArrowRight, Calendar } from 'lucide-react';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import fetchCountries from '@/lib/getCountries';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import Modal from '@/components/modal/modal';
import { z } from 'zod';
import Link from 'next/link';
import { ICategory } from '@/models/Category';

const jobSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  tags: z
    .array(z.string())
    .nonempty({ message: 'At least one tag is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  minSalary: z
    .number()
    .nonnegative({ message: 'Minimum salary must be 0 or more' }),
  maxSalary: z
    .number()
    .nonnegative({ message: 'Maximum salary must be 0 or more' }),
  salaryType: z.enum(['Hourly', 'Monthly', 'Project Basis']),
  education: z.string().min(1, { message: 'Education level is required' }),
  exprience: z.string().min(1, { message: 'Experience is required' }),
  type: z.enum([
    'Full Time',
    'Part Time',
    'Contract',
    'FreeLance',
    'Internship',
  ]),
  vacancies: z
    .number()
    .min(1, { message: 'There must be at least one vacancy' }),
  expire: z.date(),
  locationA: z.string().min(1, { message: 'Country is required' }),
  categoryId: z.string({ message: 'Category is required' }),
  benefits: z.array(z.string()).optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  applyOn: z.enum(['jobpilot', 'email', 'other']),
  skills: z.array(z.string()).optional(),
  applicatiions: z.array(z.string()).optional(),
});

const validateJob = (data: IJob) => {
  try {
    return jobSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      toast.error(error.issues[0]?.message);
    }
    return null;
  }
};

const PostJob = () => {
  const [formData, setFormData] = useState<IJob>({
    title: '',
    tags: [],
    role: '',
    minSalary: 0,
    maxSalary: 0,
    salaryType: 'Hourly',
    education: '',
    exprience: '',
    type: 'FreeLance',
    vacancies: 0,
    expire: new Date(),
    locationA: '',
    benefits: [],
    description: '',
    applyOn: 'jobpilot',
    skills: [],
    categoryId: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<
    | null
    | {
        name: {
          common: string;
        };
      }[]
  >(null);

  const closeModal = () => setIsOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      formData.tags = tags;
      setFormData(formData);
      console.log(formData);

      if (!validateJob({ ...formData, tags })) return setLoading(false);
      await axios.post('/api/jobs', formData);
      setIsOpen(true);
    } catch (e) {
      if (e instanceof AxiosError) {
        setLoading(false);
        return toast.error(e.response?.data.message || 'An error occured');
      } else {
        setLoading(false);
        console.log(e);
        return toast.error('An error occured');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | string,
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, description: e }));
      return;
    }
    if (e.target.type === 'number')
      return setFormData((prev) => ({
        ...prev,
        [e.target.id]: Number(e.target.value),
      }));
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, expire: date } as IJob));
  };

  const toggleBenefit = (index: number) => {
    setFormData((prev) => {
      if (prev.benefits.includes(benefits[index]))
        return {
          ...prev,
          benefits: prev.benefits.filter(
            (benefit) => benefit !== benefits[index],
          ),
        };
      return { ...prev, benefits: [...prev.benefits, benefits[index]] };
    });
  };

  useEffect(() => {
    const getCountries = async () => {
      try {
        setCountries(await fetchCountries());
        setCountries((prev) => {
          if (!prev) return null;
          return prev.sort((a, b) => {
            const nameA = a.name.common.toLowerCase();
            const nameB = b.name.common.toLowerCase();
            return nameA.localeCompare(nameB);
          });
        });
      } catch (e) {
        console.log(e);
      }
    };

    const getCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (e) {
        if (e instanceof AxiosError) {
          return toast.error(e.response?.data.message || 'An error occured');
        } else {
          console.log(e);
          return toast.error('An error occured');
        }
      }
    };
    getCountries();
    getCategories();
  }, []);

  const boldCommand: Command = {
    icon: () => <strong>B</strong>,
    execute: ({ initialState, textApi }) => {
      const { selectedText } = initialState;
      textApi.replaceSelection(`**${selectedText || 'bold text'}**`);
    },
  };

  // Italic Command in TypeScript
  const italicCommand: Command = {
    icon: () => <em>I</em>,
    execute: ({ initialState, textApi }) => {
      const { selectedText } = initialState;
      textApi.replaceSelection(`*${selectedText || 'italic text'}*`);
    },
  };

  return (
    <div>
      <h3>Post a job</h3>
      <div className={styles.form}>
        <div className={`${styles.entry} ${styles.full}`}>
          <label htmlFor='title'>Job Title</label>
          <input id='title' value={formData.title} onChange={handleChange} />
        </div>
        <div className={`${styles.entry} ${styles.tagEntry}`}>
          <label htmlFor='title'>Tags</label>
          <TagInput
            tags={tags}
            setTags={setTags}
            tagsList={tagsList}
            limit={5}
          />
        </div>
        <div className={`${styles.entry} ${styles.roleEntry}`}>
          <label htmlFor='role'>Job Role</label>
          <input id='role' value={formData.role} onChange={handleChange} />
        </div>
        <div className={`${styles.entry}`}>
          <label id='categoryId'>Category</label>
          <select
            id='categoryId'
            value={(formData?.categoryId as string) || undefined}
            onChange={handleChange}
          >
            <option value={undefined}>Select...</option>
            {categories.map((value, index) => (
              <option key={index} value={value._id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.section}>
          <h4>Salary</h4>
          <div className={styles.sectionInfo}>
            <div className={`${styles.entry} ${styles.salary}`}>
              <label htmlFor='minSalary'>Min Salary</label>
              <div>
                <input
                  id='minSalary'
                  type='number'
                  value={formData.minSalary}
                  onChange={handleChange}
                />
                <span className={styles.currency}>USD</span>
              </div>
            </div>
            <div className={`${styles.entry} ${styles.salary}`}>
              <label htmlFor='maxSalary'>Max Salary</label>
              <div>
                <input
                  id='maxSalary'
                  type='number'
                  value={formData.maxSalary}
                  onChange={handleChange}
                />
                <span className={styles.currency}>USD</span>
              </div>
            </div>
            <div className={`${styles.entry} ${styles.salary}`}>
              <label id='salaryType'>Salary Type</label>
              <select
                id='salaryType'
                value={formData?.salaryType || undefined}
                onChange={handleChange}
              >
                <option value={undefined}>Select...</option>
                {salaryType.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Advance Information</h4>
          <div className={styles.sectionInfo}>
            <div className={`${styles.entry} ${styles.advance}`}>
              <label id='education'>Education</label>
              <select
                id='education'
                value={formData?.education || undefined}
                onChange={handleChange}
              >
                <option value={undefined}>Select...</option>
                {educations.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.entry} ${styles.advance}`}>
              <label id='exprience'>Experience</label>
              <select
                id='exprience'
                value={formData?.exprience || undefined}
                onChange={handleChange}
              >
                <option value={undefined}>Select...</option>
                {Object.entries(exprience).map(([key, value], index) => (
                  <option key={index} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.entry} ${styles.advance}`}>
              <label id='type'>Job Type</label>
              <select
                id='type'
                value={formData?.type || undefined}
                onChange={handleChange}
              >
                <option value={undefined}>Select...</option>
                {type.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.entry} ${styles.advance}`}>
              <label htmlFor='vacancies'>Vacancies</label>
              <input
                id='vacancies'
                type='number'
                value={formData.vacancies}
                onChange={handleChange}
              />
            </div>
            <div className={styles.date}>
              <label id='Expire'>Expiration Date</label>
              <div className={styles.dateWrap}>
                <DatePicker
                  selected={formData.expire}
                  onChange={handleDateChange}
                  dateFormat='dd-MM-yyyy'
                  placeholderText='dd/mm/yyyy'
                  showPopperArrow={false} // Remove the arrow in the popper if not needed
                  isClearable // Add clear button
                  todayButton='Today' // Show "Today" button
                  className={styles.datePicker} // You can style it with your CSS class
                />
                <Calendar />
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.greyed}`}>
          <h4>Location</h4>
          <div className={styles.sectionInfo}>
            <div className={styles.entry}>
              <label id='locationA'>Location</label>
              <select
                id='locationA'
                value={formData?.locationA || undefined}
                onChange={handleChange}
              >
                <option value={undefined}>Select...</option>
                {countries &&
                  countries.map((country) => (
                    <option
                      key={country.name.common}
                      value={country.name.common}
                    >
                      {country.name.common}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h4>Benefits</h4>
          <div className={styles.sectionInfo}>
            {benefits.map((benefit, i) => {
              if (formData.benefits.includes(benefit)) {
                return (
                  <span
                    key={i}
                    onClick={() => toggleBenefit(i)}
                    className={`${styles.benefit} ${styles.selected}`}
                  >
                    {benefit}
                  </span>
                );
              }
              return (
                <span
                  key={i}
                  onClick={() => toggleBenefit(i)}
                  className={styles.benefit}
                >
                  {benefit}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.section}>
          <h4>Job Description</h4>
          <div className={styles.sectionInfo}>
            <div className={styles.markdown}>
              <ReactMde
                value={formData.description}
                onChange={handleChange}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                }
                toolbarCommands={[['bold', 'italic']]}
                commands={{
                  bold: boldCommand,
                  italic: italicCommand,
                }}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.greyed}`}>
          <h4>Apply Job on:</h4>
          <div className={styles.sectionInfo}>
            <div
              className={`${styles.applyOption} ${
                formData.applyOn === 'jobpilot' ? styles.active : null
              }`}
            >
              <input
                type='radio'
                id='applyOn'
                value='jobpilot'
                checked={formData.applyOn === 'jobpilot'}
                onChange={handleChange}
              />
              <div className={styles.content}>
                <p>
                  <strong>On Jobpilot</strong>
                </p>
                <span>
                  Canidate will apply job using jobpilot & all application will
                  show on your dashboard.{' '}
                </span>
              </div>
            </div>
            <div
              className={`${styles.applyOption} ${
                formData.applyOn === 'other' ? styles.active : null
              }`}
            >
              <input
                type='radio'
                id='applyOn'
                value='other'
                checked={formData.applyOn === 'other'}
                onChange={handleChange}
              />
              <div className={styles.content}>
                <p>
                  <strong>External Platform</strong>
                </p>
                <span>
                  Canidate will apply job on your website, all application on
                  your website.
                </span>
              </div>
            </div>
            <div
              className={`${styles.applyOption} ${
                formData.applyOn === 'email' ? styles.active : null
              }`}
            >
              <input
                type='radio'
                id='applyOn'
                value='email'
                checked={formData.applyOn === 'email'}
                onChange={handleChange}
              />
              <div className={styles.content}>
                <p>
                  <strong>On Your Email</strong>
                </p>
                <span>
                  Canidate will apply job on your email and all application in
                  your email.
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={styles.btn}
        >
          {loading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <span>Post Job</span> <ArrowRight height={18} width={18} />
            </>
          )}
        </button>
      </div>
      <Modal title='' isLoading={loading} isOpen={isOpen} onClose={closeModal}>
        <div>
          <h3>🎉 Congratulations, Your Job is Successfully posted!</h3>
          <Link href='/dashboard/my-jobs' className={styles.viewLink}>
            {loading ? (
              <span>Uploading</span>
            ) : (
              <>
                <span>View Jobs</span> <ArrowRight height={18} width={18} />
              </>
            )}
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default PostJob;
