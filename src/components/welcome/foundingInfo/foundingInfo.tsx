import { IEmployerDocument } from '@/models/employer';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styles from './foundingInfo.module.css';
import { ArrowRight, Calendar, Link } from 'lucide-react';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  industryType,
  orginizationType,
  teamSize,
} from '@/lib/data/companyInfo';

const FoundingInfo = ({
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
  const handleDateChange = (date: Date | null) => {
    setFormData(
      (prev) => ({ ...prev, yearOfEstablishment: date } as IEmployerDocument),
    );
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | string,
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, vision: e } as IEmployerDocument));
      return;
    }
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
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

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
          {orginizationType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
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
          {industryType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.date}>
        <label id='Year of Establishment'>Year of Establishment</label>
        <div className={styles.dateWrap}>
          <DatePicker
            selected={formData.yearOfEstablishment}
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
        <label id='teamSize'>Team Size</label>
        <select
          id='teamSize'
          value={formData.teamSize || undefined}
          onChange={handleChange}
        >
          <option value={undefined}>Select...</option>
          {Object.entries(teamSize).map(([key, value], index) => (
            <option key={index} value={key}>
              {value}
            </option>
          ))}
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
    
      <div className={styles.markdown}>
        <label id='vision'>Company Vision</label>
        <ReactMde
          value={formData.vision}
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
      <div className={styles.buttons}>
        <button
          type='button'
          onClick={previous}
          className={`${styles.btn} ${styles.back}`}
        >
          <span>Previous</span>
        </button>
        <button className={styles.btn}>
          <span>Next</span> <ArrowRight height={18} width={18} />
        </button>
      </div>
    </form>
  );
};

export default FoundingInfo;
