import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const focusableSelector = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])";

const Dialog = ({ open, title, description, onClose, children, size = "medium" }) => {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef(null);
    const closeRef = useRef(onClose);
    closeRef.current = onClose;

    useEffect(() => {
        if (!open) return undefined;

        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusTarget = panelRef.current?.querySelector("[data-initial-focus]")
            || panelRef.current?.querySelector(focusableSelector);
        focusTarget?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeRef.current?.();
                return;
            }

            if (event.key !== "Tab" || !panelRef.current) return;
            const focusable = [...panelRef.current.querySelectorAll(focusableSelector)];
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <section
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={`${styles.dialog} ${styles[size] || ""}`}
                ref={panelRef}
                role="dialog"
            >
                <header className={styles.header}>
                    <div>
                        <h2 id={titleId}>{title}</h2>
                        {description && <p id={descriptionId}>{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button">
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <div className={styles.body}>{children}</div>
            </section>
        </div>
    );
};

export default Dialog;
