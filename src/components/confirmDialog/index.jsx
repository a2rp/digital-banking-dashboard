import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onClose,
    tone = "danger",
}) => (
    <Dialog description={description} onClose={onClose} open={open} size="narrow" title={title}>
        <div className={styles.confirmation}>
            <span className={`${styles.icon} ${tone === "primary" ? styles.primary : ""}`}>
                <FiAlertTriangle aria-hidden="true" />
            </span>
            <div className={styles.actions}>
                <button className={styles.cancelButton} data-initial-focus onClick={onClose} type="button">
                    {cancelLabel}
                </button>
                <button className={tone === "primary" ? styles.primaryButton : styles.dangerButton} onClick={onConfirm} type="button">
                    {confirmLabel}
                </button>
            </div>
        </div>
    </Dialog>
);

export default ConfirmDialog;
