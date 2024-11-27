import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './personal.module.css';
import { worker } from '@/app/(home)/dashboard/workerDashboard';
import { Link } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Personal = ({ user }: { user: null | worker }) => {
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
    setLoading(true)
    
    const res = await axios.patch(`/api/workers/${user?._id}`, formData)
    if (res.status != 201) {
      setLoading(false)
      return toast.error('An error occured')
    }
    toast.success('Updated successfully.')
    setLoading(false)
    return
  };

  return (
    <>
      <h3>Basic Information</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.profile}>
          <span>Profile Picture</span>
          <div className={styles.dragDrop}>
            <p><strong>Browse photos</strong> or drop here</p>
            <p>A photo larger than 400 pixels<br /> work best. Max photo size 5MB.</p>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.entry}>
            <label id='fullName'>Full name</label>
            <input
              id='fullName'
              name='user'
              value={formData?.userId.fullName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.entry}>
            <label id='title'>Title/headline</label>
            <input id='title' value={formData?.title} onChange={handleChange} />
          </div>
          <div className={styles.entry}>
            <label id='exprience'>Exprience</label>
            <select
              id='exprience'
              value={formData?.exprience || undefined}
              onChange={handleChange}
            >
              <option value={undefined}>Select...</option>
              <option value={1}>1 year</option>
            </select>
          </div>
          <div className={styles.entry}>
            <label id='education'>Education</label>
            <select
              id='education'
              value={formData?.education || undefined}
              onChange={handleChange}
            >
              <option value={undefined}>Select...</option>
              <option value={'BSc'}>BSc</option>
              <option value={'OND'}>OND</option>
            </select>
          </div>
          <div className={`${styles.entry} ${styles.web}`}>
            <label id='website'>Personal website</label>
            <div>
              <Link height={16} width={16} className={styles.icon}/>
            <input
              id='website'
              value={formData?.website}
              onChange={handleChange}
              placeholder='Website url...'
            />
            </div>
          </div>
          <button disabled={loading} className={styles.btn}>Save Changes</button>
        </div>
      </form>
    </>
  );
};

export default Personal;
