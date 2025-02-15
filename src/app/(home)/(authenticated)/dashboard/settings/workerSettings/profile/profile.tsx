import styles from './profile.module.css';
import { WorkerWithUserInfo } from '@/components/types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import fetchCountries from '@/lib/getCountries';
import { professions } from '@/lib/data/workerInfo';

const Profile = ({ user }: { user: null | WorkerWithUserInfo }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<
    | null
    | {
        name: {
          common: string;
        };
      }[]
  >(null);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
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
  if (!formData) return null;

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date } as WorkerWithUserInfo));
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | string,
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, biography: e } as WorkerWithUserInfo));
      return;
    }
    setFormData((prev) => {
      if (e.target.name === 'user') {
        return {
          ...prev,
          userId: {
            ...prev?.userId,
            [e.target.id]: e.target.value,
          },
        } as unknown as WorkerWithUserInfo;
      } else {
        return {
          ...prev,
          [e.target.id]: e.target.value,
        } as unknown as WorkerWithUserInfo;
      }
    });
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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`/api/workers/${user?._id}`, formData);
      toast.success('Updated successfully.');
      return;
    } catch (e) {
      if (e instanceof AxiosError) {
        return toast.error(e.response?.data.msg || 'An error occured');
      } else {
        console.log(e);
        return toast.error('An error occured');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.entry}>
          <label id='nationality'>Nationality</label>
          <select
            id='nationality'
            value={formData?.nationality || undefined}
            onChange={handleChange}
          >
            <option value={undefined}>Select...</option>
            {countries &&
              countries.map((country) => (
                <option key={country.name.common} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.date}>
          <label id='Date of Birth'>Date of Birth</label>
          <div className={styles.dateWrap}>
            <DatePicker
              selected={formData.dateOfBirth}
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
        <div className={styles.entry}>
          <label id='gender'>Gender</label>
          <select
            id='gender'
            value={formData?.gender || undefined}
            onChange={handleChange}
          >
            <option value={undefined}>Select...</option>
            <option value={'Male'}>Male</option>
            <option value={'Female'}>Female</option>
          </select>
        </div>
        <div className={styles.entry}>
          <label id='maritalStatus'>Matital Status</label>
          <select
            id='maritalStatus'
            value={formData?.maritalStatus || undefined}
            onChange={handleChange}
          >
            <option value={undefined}>Select...</option>
            <option value={'single'}>Single</option>
            <option value={'married'}>Married</option>
            <option value={'divorced'}>Divorced</option>
          </select>
        </div>
        <div className={styles.entry}>
          <label id='profession'>Profession</label>
          <select
            id='profession'
            value={formData?.profession || undefined}
            onChange={handleChange}
          >
            <option value={undefined}>Select...</option>
            {professions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.markdown}>
          <label id='vision'>Biography</label>
          <ReactMde
            value={formData.biography}
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
        <button disabled={loading} className={styles.btn}>
          Save Changes
        </button>
      </form>
    </>
  );
};

export default Profile;
