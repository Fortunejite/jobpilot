'use client';
import {
  AtSign,
  CircleUserRound,
  Globe,
  UserRound,
} from 'lucide-react';
import styles from './settings.module.css';
import { useEffect, useState } from 'react';
import { ICompanyDocument } from '@/models/Company';
import { FileWithPath } from 'react-dropzone';
import CompanyInfo from './companyInfo/CompanyInfo';
import FoundingInfo from './foundingInfo/foundingInfo';
import Socials from './socials/socials';
import Contact from './contact/contact';
import { record, date, object, string, ZodError } from 'zod';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { app } from '@/firebase';

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

const CompanySetting = ({ userId }: { userId: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<ICompanyDocument>({
    companyName: '',
    email: '',
    phoneNumber: '',
    address: '',
    website: '',
    about: '',
    orginizationType: '',
    industryType: '',
    teamSize: 0,
    vision: '',
    links: {},
    logo: '',
    banner: '',
  } as unknown as ICompanyDocument);
  const [banner, setBanner] = useState<FileWithPath | undefined>(undefined);
  const [logo, setLogo] = useState<FileWithPath | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`/api/companies/${userId}`);
      setFormData(data);
    };
    getData();
  }, []);
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
        `company/${userId}/logo/${Date.now()}-${logo.name}`,
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
        `company/${userId}/banner/${Date.now()}-${banner.name}`,
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
      await axios.patch('/api/companies', {
        ...data,
        logo: logoUrl,
        banner: bannerUrl,
      });
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
        />
      ),
    },
  ];
  

  const handleChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
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
    </div>
  );
};

export default CompanySetting;
