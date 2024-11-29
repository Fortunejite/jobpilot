import { IEmployerDocument } from '@/models/employer';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from './page.module.css';
import { ArrowRight, Mail } from 'lucide-react';



const Contact = ({
  handleSubmit,
  previous,
  formData,
  setFormData,
  loading,
}: {
  handleSubmit: () => void;
  previous: () => void;
  formData: IEmployerDocument;
  setFormData: Dispatch<SetStateAction<IEmployerDocument>>;
  loading: boolean;
}) => {
  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [id]: value,
        } as IEmployerDocument),
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={styles.form}
    >
      <div className={styles.entry}>
        <label id='address'>Location</label>
        <input id='address' value={formData.address} onChange={handleChange} />
      </div>
      <div className={styles.entry}>
        <label id='phoneNumber'>Phone</label>
        <input
          id='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>
      <div className={`${styles.entry} ${styles.web}`}>
        <label id='email'>Email</label>
        <div>
          <Mail height={16} width={16} className={styles.icon} />
          <input
            id='email'
            type='email'
            value={formData?.email}
            onChange={handleChange}
            placeholder='Email address'
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          disabled={loading}
          type='button'
          onClick={previous}
          className={`${styles.btn} ${styles.back}`}
        >
          Previous
        </button>
        <button disabled={loading} className={styles.btn}>
          {
            loading ? 'Uploading' : <><span>Finish Editing</span> <ArrowRight height={18} width={18} /></>
          }
          
        </button>
      </div>
    </form>
  );
};

export default Contact;
