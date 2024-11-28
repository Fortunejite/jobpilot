import { CircleX } from "lucide-react"
import { createPortal } from "react-dom"
import styles from './modal.module.css'
const Modal = ({
  isOpen, isLoading, onClose, title, children
}: {
  isOpen: boolean,
  isLoading: boolean,
  onClose: () => void,
  title: string,
  children: JSX.Element
}) => {
  if (!isOpen) return null

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return (
    createPortal(
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>{title}</h2>
            <button disabled={isLoading} className={styles.closeButton} onClick={onClose}><CircleX /></button>
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>, modalRoot
    )
  )
}

export default Modal