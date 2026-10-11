import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo,
};

const Toast = ({ message, type = "success", onDismiss }) => {
    useEffect(() => {
        if (!message) return undefined;
        const timer = window.setTimeout(onDismiss, 4400);
        return () => window.clearTimeout(timer);
    }, [message, onDismiss]);

    if (!message) return null;
    const Icon = icons[type] || icons.success;

    return (
        <div className={styles.toast} data-type={type} role={type === "error" ? "alert" : "status"}>
            <span className={styles.icon}><Icon aria-hidden="true" /></span>
            <p>{message}</p>
            <button aria-label="Dismiss notification" className={styles.closeButton} onClick={onDismiss} type="button">
                <FiX aria-hidden="true" />
            </button>
        </div>
    );
};

export default Toast;