import { IEmployerDocument } from '@/models/employer';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from './foundingInfo.module.css';
import { ArrowRight, Link } from 'lucide-react';

const foundingInfo = ({
  handleSubmit,
  previous,
  formData,
  setFormData,
}: {
  handleSubmit: () => void;
  previous: () => void;
  formData: IEmployerDocument;
  setFormData: Dispatch<SetStateAction<IEmployerDocument>>;
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
        <label id='orginizationType'>Orginization Type</label>
        <select
          id='orginizationType'
          value={formData.orginizationType || undefined}
          onChange={handleChange}
        >
          <option value={undefined}>Select...</option>
          <option value={'Big'}>Big</option>
          <option value={'Small'}>Small</option>
        </select>
      </div>
      <div className={styles.entry}>
        <label id='industryType'>Industry Types</label>
        <select
          id='industryType'
          value={formData.industryType || undefined}
          onChange={handleChange}
        >
          <option value={undefined}>Select...</option>
          <option value={'Big'}>Big</option>
          <option value={'Small'}>Small</option>
        </select>
      </div>
      <div className={styles.entry}>
        <label id='teamSize'>Team Size</label>
        <select
          id='teamSize'
          value={formData.teamSize || undefined}
          onChange={handleChange}
        >
          <option value={undefined}>Select...</option>
          <option value={'1'}>Big</option>
          <option value={'5'}>Small</option>
        </select>
      </div>
      <div className={`${styles.entry} ${styles.web}`}>
        <label id='website'>Personal website</label>
        <div>
          <Link height={16} width={16} className={styles.icon} />
          <input
            id='website'
            value={formData?.website}
            onChange={handleChange}
            placeholder='Website url...'
          />
        </div>
      </div>
      <div className={styles.entry}>
        <label id='vision'>Company Vision</label>
        <input id='vision' value={formData.vision} onChange={handleChange} />
      </div>
      <div className={styles.buttons}>
        <button type='button' onClick={previous} className={`${styles.btn} ${styles.back}`}>Previous</button>
        <button className={styles.btn}>Next <ArrowRight height={18} width={18} /></button>
      </div>
    </form>
  );
};

export default foundingInfo;
