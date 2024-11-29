import { ArrowRight, CheckCheck } from 'lucide-react';
import styles from './completed.module.css';
import Link from 'next/link';

const Completed = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <CheckCheck height={32} width={32}/>
    </div>
    <h3>🎉 Congratulations, Your profile is 100% complete!</h3>
    <div className={styles.buttons}>
      <Link href={'/dashboard'}
      className={`${styles.link} ${styles.dashboard}`}
      >
        View Dashboard
      </Link>
      <button className={styles.link}>
        Post Job <ArrowRight height={18} width={18} />
      </button>
    </div>
  </div>
);
export default Completed;
