import { ArrowLeft, ArrowRight, FastForward, Rewind } from 'lucide-react';
import styles from './pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  changePage: (newPage: number) => Promise<void>;
}

const Pagination = ({ currentPage, totalPages, changePage }: Props) => {
  
  return (
    <div className={styles.pagination}>
      <button
        className={styles.arrow}
        onClick={() => changePage(currentPage - 5)}
        disabled={currentPage === 1}
      >
        <Rewind />
      </button>
      <button
        className={styles.arrow}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft />
      </button>
      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, index) => {
          if (index + 1 - currentPage < 5 || index + 1 + currentPage < 5)
            return (
              <button
                key={index}
                className={`${styles.page} ${
                  index + 1 === currentPage ? styles.active : ''
                }`}
                onClick={() => changePage(index + 1)}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            );
        })}
      </div>
      <button
        onClick={() => changePage(currentPage + 1)}
        className={styles.arrow}
        disabled={currentPage === totalPages}
      >
        <ArrowRight />
      </button>
      <button
        onClick={() => changePage(currentPage + 5)}
        className={styles.arrow}
        disabled={currentPage === totalPages}
      >
        <FastForward />
      </button>
    </div>
  );
};

export default Pagination