import styles from "./Modal.module.css";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  content,
  footer
}) => {

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.close} onClick={onClose}>X</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
        {
          footer && <div className={styles.footer}>{footer}</div>
        }
      </div>
    </div>
  );
}