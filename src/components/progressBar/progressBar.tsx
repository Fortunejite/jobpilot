import styles from './progress.module.css';

const ProgressBar = ({
  progress,
  title,
}: {
  progress: number;
  title: string;
}) => (
  <div className={styles.container}>
    <div className={styles.label}><span>{`${title}`}</span><span>{`${progress}% Completed`}</span></div>
    <div className={styles.filler} style={{ width: `${progress}%` }}></div>
  </div>
);

export default ProgressBar;
