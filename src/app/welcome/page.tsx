'use client';
import {
  AtSign,
  BriefcaseBusiness,
  CircleUserRound,
  Globe,
  UserRound,
} from 'lucide-react';
import styles from './page.module.css';
import CompanyInfo from '@/components/welcome/companyInfo/CompanyInfo';
import { useState } from 'react';
import ProgressBar from '@/components/progressBar/progressBar';
import { IEmployerDocument } from '@/models/employer';
import { FileWithPath } from 'react-dropzone';
import FoundingInfo from '@/components/welcome/foundingInfo/foundingInfo';
import Socials from '@/components/welcome/socials/socials';
import Contact from '@/components/welcome/contact/contact';
import { record, date, object, string, ZodError } from 'zod';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { app } from '@/firebase';
import Completed from './completed';

const formValidator = object({
  companyName: string().min(1, { message: 'Company Name is required' }),
  about: string().min(1, { message: 'About Us is required' }),
  orginizationType: string().min(1, {
    message: 'Orginization Type is required',
  }),
  industryType: string().min(1, { message: 'Industry Type is required' }),
  teamSize: string(),
  yearOfEstablishment: date(),
  website: string()
    .url({ message: 'Invalid website url' })
    .min(1, { message: 'website is required' }),
  vision: string().min(1, { message: 'vision is required' }),
  links: record(string().url({ message: 'Enter a valid social link' })),
  phoneNumber: string().min(1, { message: 'phoneNumber is required' }),
  address: string().min(1, { message: 'Location  is required' }),
  email: string().email({ message: 'Invalid email address' }),
});

const Welcome = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<IEmployerDocument>({
    companyName: '',
    email: '',
    phoneNumber: '',
    address: '',
    website: '',
    about: '',
    orginizationType: '',
    industryType: '',
    teamSize: 0,
    yearOfEstablishment: new Date(),
    vision: '',
    links: {},
    logo: '',
    banner: '',
  } as unknown as IEmployerDocument);
  const [banner, setBanner] = useState<FileWithPath | undefined>(undefined);
  const [logo, setLogo] = useState<FileWithPath | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const session = useSession();
  const user = session?.data?.user;
  if (!user) return null;
  if (user.role != 'employer') return null;
  const storage = getStorage(app);

  const validateForm = () => {
    try {
      const data = formValidator.parse(formData);
      if (!logo) {
        toast.error('Logo is required');
        return null;
      }
      if (!banner) {
        toast.error('Banner is required');
        return null;
      }
      return { ...data, logo, banner };
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(e);
        toast.error(e.issues[0].message);
        return null;
      }
      console.log(e);
      return null;
    }
  };

  const uploadLogo = async () => {
    try {
      if (!logo) return null;
      const storageRef = ref(
        storage,
        `company/${user?._id}/logo/${Date.now()}-${logo.name}`,
      );
      await uploadBytes(storageRef, logo);
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.log(e);
      setLoading(false);
      return null;
    }
  };
  const uploadBanner = async () => {
    try {
      if (!banner) return null;
      const storageRef = ref(
        storage,
        `company/${user?._id}/banner/${Date.now()}-${banner.name}`,
      );
      await uploadBytes(storageRef, banner);
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.log(e);

      setLoading(false);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = validateForm();
      if (!data) return;
      const logoPromise = uploadLogo();
      const bannerPromise = uploadBanner();
      const [logoUrl, bannerUrl] = await Promise.all([
        logoPromise,
        bannerPromise,
      ]);
      await axios.post('/api/employer', {
        ...data,
        logo: logoUrl,
        banner: bannerUrl,
      });
      setIsSuccessful(true);
      setProgress(100);
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.msg);
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      name: 'Company Info',
      icon: <UserRound />,
      component: (
        <CompanyInfo
          handleSubmit={() => handleChange(1)}
          formData={formData}
          setFormData={setFormData}
          logo={logo}
          banner={banner}
          setBanner={setBanner}
          setLogo={setLogo}
        />
      ),
    },
    {
      name: 'Founding Info',
      icon: <CircleUserRound />,
      component: (
        <FoundingInfo
          handleSubmit={() => handleChange(2)}
          previous={() => handleChange(0)}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      name: 'Social Media Profile',
      icon: <Globe />,
      component: (
        <Socials
          handleSubmit={() => handleChange(3)}
          previous={() => handleChange(1)}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      name: 'Contact',
      icon: <AtSign />,
      component: (
        <Contact
          handleSubmit={handleSubmit}
          previous={() => handleChange(2)}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
  ];

  const handleChange = (tabIndex: number) => {
    setProgress((tabIndex / tabs.length) * 100);
    setActiveTab(tabIndex);
  };

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.logo}>
          <BriefcaseBusiness height={32} width={32} /> <h3>Jobpilot</h3>
        </div>
        <ProgressBar progress={progress} title='Startup Progress' />
      </header>
      {isSuccessful ? (
        <Completed />
      ) : (
        <>
          <ul className={styles.tabs}>
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={activeTab === index ? styles.active : ''}
                onClick={() => (loading ? null : handleChange(index))}
              >
                {tab.icon} <span>{tab.name}</span>
              </li>
            ))}
          </ul>
          <main>{tabs[activeTab].component}</main>
        </>
      )}
    </div>
  );
};

export default Welcome;
