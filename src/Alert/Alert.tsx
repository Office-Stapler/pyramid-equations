import { useEffect, useState } from "react";
import styles from "./Alert.module.css";
import classNames from "classnames";

export type AlertType = "info" | "success" | "warning" | "error";

type AlertProps = {
  title?: string;
  message?: string;
  onClose?: () => void;
  variant?: AlertType;
}

const alertStyles: Record<AlertType, string> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
}

export const Alert: React.FC<AlertProps> = ({ onClose, variant, title, message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  }

  const onChange = () => {
    // Automatically close the alert after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    return () => clearTimeout(timer);
  }

  useEffect(() => {
    if (!title && !message) {
      return;
    }
    setIsVisible(true);
    return onChange();
  }, [onClose, variant, title, message]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={
      classNames(
        styles.alertContainer,
        alertStyles[variant ?? "info"],
        { [styles.hidden]: !isVisible }
      )}>
      <div className={styles.alertContent}>
        {title && <div className={styles.alertTitle}>{title}</div>}
        {message && <div className={styles.alertMessage}>{message}</div>}
      </div>
    </div>
  )
}

