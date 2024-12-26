import { BriefcaseBusiness, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import styles from './page.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
    <div className={styles.main}>
      <div className={styles.logo}>
        <div>
          <BriefcaseBusiness />
          <span>Jobpilot</span>
        </div>
        <p>Call now: <span>{'(+234) 913-040-725'}</span></p>
        <p>Discover tailored opportunities for job seekers and top talent for employers</p>
      </div>
      <div>
        <p className={styles.title}>Quick Link</p>
        <ul>
          <li>About</li>
          <li>Contact</li>
          <li>Pricing</li>
          <li>Blog</li>
        </ul>
      </div>
      <div>
        <p className={styles.title}>Canidate</p>
        <ul>
          <li>Browse Jobs</li>
          <li>Browse Employers</li>
          <li>Candidates Dashboard</li>
          <li>Saved Jobs</li>
        </ul>
      </div>
      <div>
        <p className={styles.title}>Employers</p>
        <ul>
          <li>Post a Job</li>
          <li>Browse Candidates</li>
          <li>Employers Dashboard</li>
          <li>Applications</li>
        </ul>
      </div>
      <div>
        <p className={styles.title}>Support</p>
        <ul>
          <li>FAQs</li>
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
        </ul>
      </div>
    </div>
    <div className={styles.bottom}>
      <p>© 2021 Jobpilot • Job Portal. All rights Reserved</p>
      <div>
        <Facebook />
        <Youtube />
        <Instagram />
        <Twitter />
      </div>
    </div>
    </div>
  );
};

export default Footer;
