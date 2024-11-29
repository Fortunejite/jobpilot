import styles from './profile.module.css';
import { worker } from '@/app/(home)/(authenticated)/dashboard/workerDashboard';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = ({ user }: { user: null | worker }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  if (!formData) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) =>
    setFormData((prev) => {
      if (e.target.name === 'user') {
        return {
          ...prev,
          userId: {
            ...prev?.userId,
            [e.target.id]: e.target.value,
          },
        } as unknown as worker;
      } else {
        return {
          ...prev,
          [e.target.id]: e.target.value,
        } as unknown as worker;
      }
    });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await axios.patch(`/api/workers/${user?._id}`, formData);
    if (res.status != 201) {
      setLoading(false);
      return toast.error('An error occured');
    }
    toast.success('Updated successfully.');
    setLoading(false);
    return;
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
            <option value={'Nigeria'}>Nigeria</option>
            <option value={'Ghana'}>Ghana</option>
          </select>
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
          <label id='biography'>Biography</label>
          <input
            id='biography'
            value={formData.biography}
            onChange={handleChange}
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