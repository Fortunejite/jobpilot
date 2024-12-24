import { X } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useState,
} from 'react';
import styles from './tagInput.module.css';

const TagInput = ({
  tags,
  setTags,
  tagsList,
  limit,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  tagsList: string[];
  limit: number;
}) => {
  const [tag, setTag] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTag(e.target.value);

  const handleRemove = (index: number) => {
    setTags((prev) => prev.filter((value, i) => index !== i));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const code = e.key;
    const newTag = tag.trim();
    if ((code !== 'Enter' && code !== ',') || tag.length === 0) return;
    if (!tags.includes(tag)) setTags((prev) => [...prev, newTag]);
    setTimeout(() => {
      setTag('');
    }, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tags}>
        {tags.map((tag, i) => (
          <div key={i} className={styles.tag}>
            <span>{tag}</span>
            <X onClick={() => handleRemove(i)} height={18} width={18} />
          </div>
        ))}
      </div>
      {tags.length !== limit ? (
        <input
          type='text'
          value={tag}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          list='list'
          placeholder='Type tag here'
        />
      ) : null}
      <datalist id='list'>
        {tagsList.map((tag, i) => (
          <option key={i} value={tag}></option>
        ))}
      </datalist>
    </div>
  );
};

export default TagInput;
