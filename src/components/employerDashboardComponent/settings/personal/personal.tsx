import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './personal.module.css';
import { worker } from '@/app/(home)/(authenticated)/dashboard/workerDashboard';
import { CirclePlus, File, Link } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileWithPath, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { app } from '@/firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import Modal from '@/components/modal/modal';

const Personal = ({ user }: { user: null | worker }) => {
  const [formData, setFormData] = useState(user);
  const [CVData, setCVData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [CV, setCV] = useState<FileWithPath | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [CVProgress, setCVProgress] = useState<number | undefined>(undefined);
  const storage = getStorage(app);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCVData('');
    setCV(null);
    setModalLoading(false);
    setCVProgress(undefined);
  };

  const formatFileSize = (sizeInByte: number) => {
    return (sizeInByte / (1024 * 1024)).toFixed(2);
  };

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles[0]);
    setPreview(URL.createObjectURL(acceptedFiles[0]));
  };
  const onCVDrop = (acceptedFiles: FileWithPath[]) => {
    setCV(acceptedFiles[0]);
    openModal();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });
  const {
    getRootProps: CvRootProps,
    getInputProps: CVInputProps,
    isDragActive: isCVDragActive,
  } = useDropzone({
    onDrop: onCVDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });
  if (!formData) return null;

  const uploadCV = async () => {
    if (!CV) return;
    setModalLoading(true);
    const storageRef = ref(
      storage,
      `workers/resume/${user?._id}/${Date.now()}-${CVData}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, CV);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setCVProgress(
          Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      (e) => {
        toast.error('An error occured');
        console.log(e);
        setModalLoading(false);
        setCVProgress(undefined);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        formData.resume.push({
          url: downloadURL,
          name: CVData,
          size: CV?.size || 0,
        });

        const res = await axios.patch(`/api/workers/${user?._id}`, formData);
        if (res.status != 201) {
          setModalLoading(false);
          setCVProgress(undefined);
          setCVProgress(undefined);
          toast.error('An error occured');
          formData?.resume.pop();
          setFormData(formData);
        }
        closeModal();

        toast.success('Resume Uploaded');
      },
    );
  };
  const uploadFile = async (file: FileWithPath) => {
    const storageRef = ref(
      storage,
      `workers/profile/${user?._id}/${Date.now()}-${file.name}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setProgress(
          Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      (e) => {
        toast.error('An error occured');
        console.log(e);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          formData.avatar = downloadURL;
          setFormData(formData);
          console.log(formData.userId);
          const res = await axios.patch(`/api/workers/${user?._id}`, formData);
          if (res.status != 201) {
            setLoading(false);
            return toast.error('An error occured');
          }
          toast.success('Updated successfully.');
          setLoading(false);
        } catch (e) {
          console.error(e);
          toast.error('An error occured');
        }
      },
    );
    return uploadTask;
  };

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

    if (file) {
      uploadFile(file);
      return;
    } else {
      const res = await axios.patch(`/api/workers/${user?._id}`, formData);
      if (res.status != 201) {
        setLoading(false);
        return toast.error('An error occured');
      }
      toast.success('Updated successfully.');
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <h3>Basic Information</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.profile}>
          <div className={styles.wrapper}>
            <span>Profile Picture</span>
            <div {...getRootProps()} className={styles.dragDrop}>
              <input {...getInputProps()} />
              {isDragActive ? (
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
            </div>
          </div>
          {preview && (
            <div className={styles.preview}>
              <h4>Preview:</h4>
              <Image src={preview} alt='Selected' width={300} height={300} />
            </div>
          )}
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
              <Link height={16} width={16} className={styles.icon} />
              <input
                id='website'
                value={formData?.website}
                onChange={handleChange}
                placeholder='Website url...'
              />
            </div>
          </div>
          <button disabled={loading} className={styles.btn}>
            {loading ? (
              <span>Please wait... {progress}%</span>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>

      <h3>Your CV/Resume</h3>
      {formData?.resume && (
        <div className={styles.cvList} >
          {formData.resume.map((resume) => (
            <div key={resume.url} className={styles.cv}>
              <File height={24} width={24} />
              <div className={styles.content}>
                <p>{resume.name}</p>
                <span>{formatFileSize(resume.size)} MB</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div {...CvRootProps()} className={styles.addCV}>
        <CirclePlus />
        <input {...CVInputProps()} />
        <div className={styles.content}>
          <p>
            <strong>Add CV/Resume</strong>
          </p>
          {isCVDragActive ? (
            <p>Drop CV here</p>
          ) : (
            <span>Browse file or drop here. only pdf</span>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        isLoading={modalLoading}
        onClose={closeModal}
        title='Add CV/Resume'
      >
        <div className={styles.modal}>
          <div className={styles.entry}>
            <label id='cv'>CV/Resume Name</label>
            <input
              id='cv'
              value={CVData}
              onChange={(e) => setCVData(e.target.value)}
            />
          </div>
          {CV && (
            <div className={styles.cv}>
              <File />
              <div className={styles.content}>
                <p>{CV.name}</p>
                <span>{formatFileSize(CV.size)} MB</span>
              </div>
            </div>
          )}
          <div className={styles.footer}>
            <button
              disabled={modalLoading}
              onClick={closeModal}
              className={styles.cancleBtn}
            >
              Cancel
            </button>
            <button onClick={() => uploadCV()} disabled={modalLoading}>
              {CVProgress ? `Uploading... ${CVProgress}%` : 'Add Cv/Resume'}{' '}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Personal;
