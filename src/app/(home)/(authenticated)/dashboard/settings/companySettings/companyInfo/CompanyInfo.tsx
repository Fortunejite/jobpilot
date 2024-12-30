import { ICompanyDocument } from '@/models/Company';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styles from './companyInfo.module.css';
import { FileWithPath, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ReactMde, { Command } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

const CompanyInfo = ({
  handleSubmit,
  formData,
  setFormData,
  logo,
  banner,
  setBanner,
  setLogo,
}: {
  handleSubmit: () => void;
  formData: ICompanyDocument;
  setFormData: Dispatch<SetStateAction<ICompanyDocument>>;
  logo: FileWithPath | undefined;
  banner: FileWithPath | undefined;
  setLogo: Dispatch<SetStateAction<FileWithPath | undefined>>;
  setBanner: Dispatch<SetStateAction<FileWithPath | undefined>>;
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | string,
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, about: e } as ICompanyDocument));
      return;
    }
    const id = e.target.id;
    const value = e.target.value;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [id]: value,
        } as ICompanyDocument),
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

  const onBannerDrop = (acceptedFiles: FileWithPath[]) => {
    setBanner(acceptedFiles[0]);
  };
  const onLogoDrop = (acceptedFiles: FileWithPath[]) => {
    setLogo(acceptedFiles[0]);
  };

  const {
    getRootProps: logoRootProps,
    getInputProps: logoInputProps,
    isDragActive: isLogoDragActive,
  } = useDropzone({
    onDrop: onLogoDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });
  const {
    getRootProps: bannerRootProps,
    getInputProps: bannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: onBannerDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={styles.form}
    >
      <div className={styles.images}>
        <div className={styles.logo}>
          <p>Upload Logo</p>
          <div {...logoRootProps()} className={styles.logoDrop}>
            <input {...logoInputProps()} />
            {logo ? (
              <div className={styles.imageContainer}>
                <Image src={URL.createObjectURL(logo)} alt='Logo' fill />
              </div>
            ) : (
              <>
                {isLogoDragActive ? (
                  <p>Drop image here</p>
                ) : (
                  <p>
                    <strong>Browse photos</strong> or drop here
                  </p>
                )}
                <p>
                  A photo larger than 400 pixels
                  <br /> work best. Max photo size 5MB.
                </p>
              </>
            )}
          </div>
        </div>
        <div className={styles.banner}>
          <p>Banner Image</p>
          <div {...bannerRootProps()} className={styles.bannerDrop}>
            <input {...bannerInputProps()} />
            {banner ? (
              <div className={styles.imageContainer}>
                <Image src={URL.createObjectURL(banner)} alt='Logo' fill />
              </div>
            ) : (
              <>
                {isBannerDragActive ? (
                  <p>Drop image here</p>
                ) : (
                  <p>
                    <strong>Browse photos</strong> or drop here
                  </p>
                )}
                <p>
                  A photo larger than 400 pixels
                  <br /> work best. Max photo size 5MB.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.entry}>
          <label id='companyName'>Company Name</label>
          <input
            id='companyName'
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.markdown}>
          <label id='vision'>About Us</label>
          <ReactMde
            value={formData.about}
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
        <button className={styles.btn}>
          <span>Next</span>
          <ArrowRight height={18} width={18} />
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;
