'use client';

import {
  ArrowRight,
  Building2,
  CircleUser,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './page.module.css';
import axios, { AxiosError } from 'axios';
import { boolean, object, string, ZodError } from 'zod';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

const Signup = () => {
  const [formData, setformData] = useState({
    isWorker: true,
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateCredentials = (formData: unknown) => {
    const credentialsParser = object({
      email: string().email({ message: 'Invalid email address' }),
      username: string()
        .min(3, { message: 'Username is a minimum of 3 characters' })
        .max(20, { message: 'Username is a maximum of 20 characters' }),
      fullName: string().min(1, { message: 'Full name cannot be empty' }),
      password: string()
        .min(6, { message: 'Password is a minimum of 6 characters' })
        .max(30, { message: 'Password is a maximum of 30 characters' }),
      isWorker: boolean(),
    });

    try {
      const credentials = credentialsParser.parse(formData);
      return credentials;
    } catch (e) {
      if (e instanceof ZodError) {
        toast.error(e.issues[0].message);
        return null;
      }
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = validateCredentials(formData);
      if (!data) return setLoading(false);
      if (data.password != formData.confirmPassword) {
        toast.error('Passowrds do not match');
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/user', data);
      if (res.status !== 201) {
        toast.error(res.data.msg);
        setLoading(false);
        return;
      }
      signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: data.isWorker ? '/' : '/welcome',
      });
      toast.success(res.data.msg);
    } catch (e) {
      setLoading(false);
      console.log(e);
      toast.error('An error occured');
    }
    try {
      setLoading(true);
      const data = validateCredentials(formData);
      if (!data) return
      if (data.password != formData.confirmPassword) {
        toast.error('Passowrds do not match');
        return;
      }
      await axios.post('/api/user', data);
      signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: data.isWorker ? '/' : '/welcome',
      });
      toast.success("Signin successfull");
    } catch (e) {
      if (e instanceof AxiosError) {
        return toast.error(e.response?.data.message || 'An error occured');
      } else {
        console.log(e);
        return toast.error('An error occured');
      }
    } finally {
      setLoading(false);

    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  return (
    <>
      <h1>Create account</h1>
      <p>
        Already have an account? <Link href={'/login'}>Log in</Link>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.accountType}>
          <p>create account as a</p>
          <div className={styles.accountTypeOptions}>
            <div
              className={formData.isWorker ? styles.active : ''}
              onClick={
                !formData.isWorker
                  ? () =>
                      setformData((prev) => ({
                        ...prev,
                        isWorker: !prev.isWorker,
                      }))
                  : () => {}
              }
            >
              <CircleUser height={24} width={24} />
              <span>Candidate</span>
            </div>
            <div
              className={!formData.isWorker ? styles.active : ''}
              onClick={
                formData.isWorker
                  ? () =>
                      setformData((prev) => ({
                        ...prev,
                        isWorker: !prev.isWorker,
                      }))
                  : () => {}
              }
            >
              <Building2 height={24} width={24} />
              <span>Employers</span>
            </div>
          </div>
        </div>
        <div className={styles.name}>
          <input
            type='text'
            required
            placeholder='Full Name'
            value={formData.fullName}
            id='fullName'
            onChange={handleChange}
          />
          <input
            type='text'
            required
            placeholder='Username'
            value={formData.username}
            id='username'
            onChange={handleChange}
          />
        </div>
        <input
          type='email'
          required
          value={formData.email}
          placeholder='Email Address'
          id='email'
          onChange={handleChange}
        />
        <div className={styles.password}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            required
            placeholder='Password'
            id='password'
            value={formData.password}
            onChange={handleChange}
          ></input>
          {passwordVisible ? (
            <EyeOff onClick={() => setPasswordVisible((prev) => !prev)} />
          ) : (
            <Eye onClick={() => setPasswordVisible((prev) => !prev)} />
          )}
        </div>
        <div className={styles.password}>
          <input
            type={password2Visible ? 'text' : 'password'}
            required
            placeholder='Confirm Password'
            id='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
          ></input>
          {password2Visible ? (
            <EyeOff onClick={() => setPassword2Visible((prev) => !prev)} />
          ) : (
            <Eye onClick={() => setPassword2Visible((prev) => !prev)} />
          )}
        </div>
        <button disabled={loading}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <span>Create Account</span> <ArrowRight />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default Signup;
