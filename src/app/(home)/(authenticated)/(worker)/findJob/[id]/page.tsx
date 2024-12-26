'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { IEmployerDocument } from '@/models/employer';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useEffect, useState } from 'react';
import { IJob } from '@/models/job';
import Image from 'next/image';
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Calendar,
  Layers,
  Map,
  Timer,
  UsersRound,
  WalletMinimal,
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { exprience } from '@/lib/data/workerInfo';
import Modal from '@/components/modal/modal';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { IWorkerDocument } from '@/models/worker';
import Footer from '@/components/DarkFooter/page';

type Params = {
  id: string;
};

type JobWithCompanyDetails = IJob & { companyId: IEmployerDocument } & {
  _id: string;
  createdAt: string;
};

type DataContent = {
  coverLetter: string;
  resume: number;
};

const FindJob = () => {
  const params: Params = useParams();
  const [job, setJob] = useState<null | JobWithCompanyDetails>(null);
  const [worker, setWorker] = useState<null | IWorkerDocument>(null);
  const [favouriteJobs, setFavouriteJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const isFavourite = favouriteJobs.includes(job?._id || '');
  const [modalData, setModalData] = useState<DataContent>({
    coverLetter: '',
    resume: -1,
  });
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

  const session = useSession();
  const userId = session?.data?.user?._id;

  const applied = job?.applicatiions.filter(
    (application) => application.userId.toString() === userId,
  );

  useEffect(() => {
    if (applied && applied.length > 0) {
      setHasApplied(true);
    }
  }, [applied]);

  const closeModal = () => setIsOpen(false);

  const toggleBookmark = (id: string) => {
    if (!favouriteJobs) return;

    const isFavourite = favouriteJobs.includes(id);
    let jobs;
    if (isFavourite) {
      jobs = favouriteJobs.filter((jobId) => jobId != id);
    } else {
      jobs = [...favouriteJobs, id];
    }
    setFavouriteJobs(jobs);

    try {
      axios.patch(`/api/workers/${userId}/favouriteJobs`, jobs);
    } catch (e) {
      if (e instanceof AxiosError) {
        return toast.error(e.response?.data.message || 'An error occured');
      } else {
        console.log(e);
        return toast.error('An error occured');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/job/${params.id}`);
        setJob(res.data);
      } catch (e) {
        if (e instanceof AxiosError) {
          return toast.error(e.response?.data.message || 'An error occured');
        } else {
          console.log(e);
          return toast.error('An error occured');
        }
      }
    };

    fetchData();
  }, [params.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;
        const workerResponse = await axios.get(`/api/workers/${userId}`);
        setWorker(workerResponse.data.data);
        setFavouriteJobs(workerResponse.data.data.favouriteJobs || []);
      } catch (e) {
        if (e instanceof AxiosError) {
          return toast.error(e.response?.data.message || 'An error occured');
        } else {
          console.log(e);
          return toast.error('An error occured');
        }
      }
    };

    fetchData();
  }, [session, userId]);

  const pickResume = (index: number) =>
    setModalData((prev) => ({ ...prev, resume: index }));
  const onCoverLetterChange = (value: string) => {
    setModalData((prev) => ({ ...prev, coverLetter: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (modalData.resume < 0) return toast.error('Please choose a resume');
      if (modalData.coverLetter === '')
        return toast.error('Cover letter cannot be empty');

      await axios.post(`/api/job/${job?._id}/apply`, modalData);
      toast.success('Job applied successfully');
      setHasApplied(true);
      closeModal();
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
    <div className={styles.container}>
      <header>
        <span>Job Detalis</span>
        <div>
          <Link href={'/'}>Home</Link>
          <Link href={'/findJob'}>{'\t/\tFind job\t/'}</Link>
          <span>{'\tJob Details'}</span>
        </div>
      </header>
      {job ? (
        <main>
          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.imageWrapper}>
                <Image
                  src={job.companyId.logo}
                  alt={job.companyId.companyName}
                  fill
                />
              </div>
              <div className={styles.companyDetails}>
                <h3>{job.title}</h3>
                <div className={styles.companySubDetails}>
                  <p>{`at ${job.companyId.companyName}`}</p>
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div onClick={() => toggleBookmark(job._id)}>
                <Bookmark className={isFavourite ? styles.favourite : ''} />
              </div>
              {!hasApplied ? (
                <button onClick={() => setIsOpen(true)}>
                  <span>Apply Now</span>
                  <ArrowRight />
                </button>
              ) : (
                <button className={styles.applied}>
                  <span>Already Applied</span>
                </button>
              )}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.left}>
              <h4>Job Description</h4>
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
            <div className={styles.right}>
              <section>
                <div className={styles.salary}>
                  <p className={styles.heading}>Salary (USD)</p>
                  <p
                    className={styles.salaryAmount}
                  >{`$${job.minSalary} - $${job.maxSalary}`}</p>
                  <span>{`${job.salaryType} salary`}</span>
                </div>
                <div className={styles.location}>
                  <Map />
                  <p className={styles.heading}>Job Location</p>
                  <span>{job.country}</span>
                </div>
              </section>
              {job.benefits.length > 0 && (
                <section>
                  <div className={styles.benefits}>
                    <p className={styles.heading}>Job Benefits</p>
                    <div>
                      {job.benefits.map((benefit, i) => (
                        <span key={i} className={styles.benefit}>
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}
              <section>
                <div className={styles.overview}>
                  <p className={styles.heading}>Job Overview</p>
                  <div className={styles.cover}>
                    <div className={styles.item}>
                      <Calendar />
                      <span>Job Posted</span>
                      <p>{formatDate(new Date(job.createdAt))}</p>
                    </div>
                    <div className={styles.item}>
                      <Timer />
                      <span>Job Expire in</span>
                      <p>{formatDate(new Date(job.expire))}</p>
                    </div>
                    <div className={styles.item}>
                      <Layers />
                      <span>Job Role</span>
                      <p>{job.role}</p>
                    </div>
                    <div className={styles.item}>
                      <WalletMinimal />
                      <span>Experience</span>
                      <p>
                        {
                          exprience[
                            parseInt(job.exprience) as keyof typeof exprience
                          ]
                        }
                      </p>
                    </div>
                    <div className={styles.item}>
                      <BriefcaseBusiness />
                      <span>Education</span>
                      <p>{job.education}</p>
                    </div>
                    <div className={styles.item}>
                      <UsersRound />
                      <span>Total Vacancies</span>
                      <p>{job.vacancies}</p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className={styles.tags}>
                  <p className={styles.heading}>Job tags:</p>
                  <div>
                    {job.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      ) : null}
      <Footer />
      <Modal
        isLoading={loading}
        isOpen={isOpen}
        onClose={closeModal}
        title={`Apply Job: ${job?.title}`}
      >
        <div>
          <div className={styles.entry}>
            <label id='resume'>Resume</label>
            <select
              id='resume'
              value={modalData?.resume}
              onChange={(e) => pickResume(parseInt(e.target.value))}
            >
              <option value={-1}>Select...</option>
              {worker &&
                worker.resume.map((resume, index) => (
                  <option key={index} value={index}>
                    {resume.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.markdown}>
            <label id='coverLetter'>Cover Letter</label>
            <ReactMde
              value={modalData.coverLetter}
              onChange={onCoverLetterChange}
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
          <div className={styles.modalFooter}>
            <button
              disabled={loading}
              className={styles.cancelBtn}
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              <span>Apply Now</span>
              <ArrowRight />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FindJob;
