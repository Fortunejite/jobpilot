import { IEmployerDocument } from '@/models/employer';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styles from './foundingInfo.module.css';
import { ArrowRight, Link } from 'lucide-react';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({...prev, yearOfEstablishment: date} as IEmployerDocument));
  }
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
    execute: ({initialState, textApi}) => {
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
          <option value={'Government'}>Government</option>
          <option value={'NGO'}>NGO</option>
          <option value={'Public'}>Public</option>
          <option value={'Private'}>Private</option>
          <option value={'International Agencies'}>
            International Agencies
          </option>
          <option value={'Semi Government'}>Semi Government</option>
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
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        showPopperArrow={false} // Remove the arrow in the popper if not needed
        isClearable // Add clear button
        todayButton="Today" // Show "Today" button
        className="custom-input" // You can style it with your CSS class
      />
      <p>
        Selected Date:{" "}
        {selectedDate ? selectedDate.toLocaleDateString() : "None"}
      </p>
    </div>
      <div className={styles.entry}>
        <label id='teamSize'>Team Size</label>
        <select
          id='teamSize'
          value={formData.teamSize || undefined}
          onChange={handleChange}
        >
          <option value={undefined}>Select...</option>
          <option value={'Only Me'}>Only Me</option>
          <option value={'10 Members'}>10 Members</option>
          <option value={'10-20 Members'}>10-20 Members</option>
          <option value={'20-50 Members'}>20-50 Members</option>
          <option value={'50-100 Members'}>50-100 Members</option>
          <option value={'100-200 Members'}>100-200 Members</option>
          <option value={'200-500 Members'}>200-500Members</option>
          <option value={'500+ Members'}>500+ Members</option>
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
          Previous
        </button>
        <button className={styles.btn}>
          Next <ArrowRight height={18} width={18} />
        </button>
      </div>
      
    </form>
  );
};

export default foundingInfo;
