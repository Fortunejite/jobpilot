import axios, { AxiosError } from 'axios';
import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { WorkerWithUserInfo } from '@/components/types';
import styles from './socials.module.css';
import { CirclePlus, CircleX } from 'lucide-react';
import links from '@/lib/data/socialLinks';

const Socials = ({ user }: { user: null | WorkerWithUserInfo }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [activeLinks, setActiveLinks] = useState(
    formData?.links ? links.filter((link) => link.name in formData.links) : [],
  );
  if (!formData) return null;
  if (!formData?.links) {
    formData.links = {};
    setFormData(formData);
  }

  const renderLinks = () => {
    return Object.entries(formData.links).map(([key, value], index) => {
      const linikIcon =
        activeLinks.find((link) => link.name === key)?.icon || null;
      return (
        <div className={styles.entry} key={key}>
          <label>Social Link {index + 1}</label>
          <div>
            <div className={styles.wrapper}>
              {linikIcon}
              <select
                id={key}
                value={key}
                onChange={(e) => handleSelectChange(key, e.target.value)}
              >
                <option value={key}>{key}</option>
                {}
                {getAvailableLinks().map((link) => {
                  return (
                    <option key={link.name} value={link.name}>
                      {link.name}
                    </option>
                  );
                })}
              </select>
              <input
                type='url'
                placeholder={'Profile link/url...'}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </div>
            <button className={styles.rmBtn} onClick={() => removeLink(key)}>
              <CircleX height={16} width={20} />
            </button>
          </div>
        </div>
      );
    });
  };

  const addLink = () => {
    for (const link of links) {
      let exists = false;
      for (const existing of activeLinks) {
        if (link.name === existing.name) {
          exists = true;
          break;
        } else exists = false;
      }
      if (!exists) {
        formData.links[link.name] = '';
        setFormData(formData);
        return setActiveLinks((prev) => [...prev, link]);
      }
    }
    return null;
  };

  const removeLink = (name: string) => {
    delete formData.links[name];
    const index = activeLinks.findIndex((link) => link.name === name);
    if (index > -1) activeLinks.splice(index, 1);
    setFormData(formData);
    setActiveLinks([...activeLinks]);
  };

  const getAvailableLinks = () => {
    return links.filter((link) => !(link.name in formData.links));
  };

  const handleInputChange = (name: string, newUrl: string) =>
    setFormData(
      (prev) =>
        ({
          ...prev,
          links: {
            ...prev?.links,
            [name]: newUrl,
          },
        } as unknown as WorkerWithUserInfo),
    );

  const handleSelectChange = (oldName: string, newName: string) => {
    const url = formData.links[oldName];
    delete formData.links[oldName];

    formData.links[newName] = url;
    const index = activeLinks.findIndex((link) => link.name === oldName);
    if (index > -1) {
      activeLinks[index] = {
        name: newName,
        icon: links.find((link) => link.name === newName)
          ?.icon as unknown as JSX.Element,
      };
    }

    setFormData(formData);
    setActiveLinks([...activeLinks]);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    Object.entries(formData.links).forEach(([key, value]) => {
      if (value === '') removeLink(key);
    });
    try {
      await axios.patch(`/api/WorkerWithUserInfos/${user?._id}`, formData);
      return toast.success('Updated successfully.');
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
    <form onSubmit={handleSubmit} className={styles.form}>
      {activeLinks && renderLinks()}
      {activeLinks.length != links.length && (
        <button type='button' className={styles.addBtn} onClick={addLink}>
          <CirclePlus height={20} width={20} />
          <span>Add new Social link</span>
        </button>
      )}
      <button disabled={loading} className={styles.btn}>
        Save Changes
      </button>
    </form>
  );
};

export default Socials;
