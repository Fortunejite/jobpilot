'use client';

import { IJob, IJobDocument } from '@/models/job';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styles from './postJob.module.css';
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
import axios from 'axios';
import Modal from '@/components/modal/modal';

const PostJob = ({
  setCount,
  switchTabs,
  setRecentJobs,
}: {
  setCount: Dispatch<SetStateAction<number>>;
  switchTabs: () => void;
  setRecentJobs: Dispatch<SetStateAction<IJobDocument[] | null>>;
}) => {
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
    country: '',
    benefits: [],
    description: '',
    applyOn: 'jobpilot',
    skills: [],
    applicatiions: [],
  });
  const [tags, setTags] = useState<string[]>([]);
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
    setFormData((prev) => ({ ...prev, tags }));
    setLoading(true);
    try {
      const res = await axios.post('/api/job', formData);
      setIsOpen(true);
      setRecentJobs((prev) => {
        if (!prev) return [formData] as IJobDocument[];
        if (prev?.length >= 5) prev?.pop();
        prev?.unshift(formData as IJobDocument);
        return prev;
      });
      setCount((prev) => prev++);
    } catch (e) {
      toast.error('An error occured');
      console.log(e);
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
    getCountries();
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
              <label id='country'>Country</label>
              <select
                id='country'
                value={formData?.country || undefined}
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
                    onClick={() => toggleBenefit(i)}
                    className={`${styles.benefit} ${styles.selected}`}
                  >
                    {benefit}
                  </span>
                );
              }
              return (
                <span
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
          <button onClick={switchTabs} className={styles.viewLink}>
            {loading ? (
              <span>Uploading</span>
            ) : (
              <>
                <span>View Jobs</span> <ArrowRight height={18} width={18} />
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PostJob;
