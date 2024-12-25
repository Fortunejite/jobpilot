'use client';

import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './page.module.css';
import { object, string, ZodError } from 'zod';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setformData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateCredentials = (formData: unknown) => {
    const credentialsParser = object({
      email: string().email({ message: 'Invalid email address' }),
      password: string()
        .min(6, { message: 'Password is a minimum of 6 characters' })
        .max(30, { message: 'Password is a maximum of 30 characters' }),
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
      setLoading(true)
      const data = validateCredentials(formData);
      if (!data) return setLoading(false);
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        redirect: false,
      });
      if (res?.error) return toast.error('Invalid credentials');
      toast.success('Signin successfull');
      router.push('/');
    } catch (e) {
      console.log(e);
      return toast.error('An error occured');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  return (
    <>
      <h1>Sign In</h1>
      <p>
        Dont have an account? <Link href={'/register'}>Create Account</Link>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <div className={styles.actions}>
          <label>
            <input
              type='checkbox'
              checked={formData.rememberMe}
              onChange={(e) =>
                setformData((prev) => ({
                  ...prev,
                  rememberMe: e.target.checked,
                }))
              }
            />
            Remember Me
          </label>
          <Link href={'/forgotPassword'}>Forgot password?</Link>
        </div>
        <button disabled={loading}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <span>Sign In</span> <ArrowRight />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default Login;
