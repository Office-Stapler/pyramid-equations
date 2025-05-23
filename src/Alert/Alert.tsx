import { useEffect, useState } from "react";
import styles from "./Alert.module.css";
import classNames from "classnames";

export type AlertType = "info" | "success" | "warning" | "error";

type AlertProps = {
  title?: string;
  message?: string;
  onClose?: () => void;
  variant?: AlertType;
  // How long before automatically disappearing and calling `onClose`
  timeout?: number;
}

const alertStyles: Record<AlertType, string> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
}

export const Alert: React.FC<AlertProps> = ({ onClose, variant, title, message, timeout = 3000 }) => {

  const [visible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically close the alert after 3 seconds
    if (timeout !== undefined) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [onClose, timeout]);

  return (
    <div className={
      classNames(
        styles.alertContainer,
        alertStyles[variant ?? "error"],
        { [styles.hidden]: !visible }
      )}>
      <div className={styles.alertContent}>
        {<div className={styles.alertTitle}>{title}</div>}
        {<div className={styles.alertMessage}>{message}</div>}
      </div>
    </div>
  )
}

