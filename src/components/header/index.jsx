import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiHelpCircle, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dialog from "../dialog";
import { formatMoney } from "../../utils/format";
import styles from "./styles.module.css";

const Header = ({ accounts, selectedAccountId, onSelectAccount }) => {
    const [accountOpen, setAccountOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const headerRef = useRef(null);
    const account = accounts.find((item) => item.id === selectedAccountId) || accounts[0];

    useEffect(() => {
        const closeOnOutside = (event) => {
            if (!headerRef.current?.contains(event.target)) setAccountOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setAccountOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    useEffect(() => {
        let previousY = window.scrollY;
        const updateHeader = () => {
            const currentY = window.scrollY;
            if (accountOpen || helpOpen || currentY <= 8 || currentY < previousY) {
                setHeaderHidden(false);
            } else if (currentY > previousY && currentY > 80) {
                setHeaderHidden(true);
            }
            previousY = currentY;
        };

        window.addEventListener("scroll", updateHeader, { passive: true });
        return () => window.removeEventListener("scroll", updateHeader);
    }, [accountOpen, helpOpen]);

    return (
        <>
            <header className={styles.header} data-hidden={headerHidden} ref={headerRef}>
                <div className={styles.inner}>
                    <Link aria-label="Vela banking home" className={styles.brand} to="/">
                        <img alt="" src={import.meta.env.BASE_URL + "vela-mark.svg"} />
                        <span>vela<span className={styles.brandDot}>.</span></span>
                    </Link>

                    <div className={styles.accountPicker}>
                        <button
                            aria-expanded={accountOpen}
                            aria-haspopup="menu"
                            className={styles.accountButton}
                            onClick={() => setAccountOpen((open) => !open)}
                            type="button"
                        >
                            <span aria-hidden="true" className={styles.accountIcon}><FiShield /></span>
                            <span className={styles.accountText}>
                                <span className={styles.accountCaption}>Viewing account</span>
                                <strong>{account?.name} <span>···· {account?.lastFour}</span></strong>
                            </span>
                            <FiChevronDown aria-hidden="true" className={accountOpen ? styles.chevronOpen : styles.chevron} />
                        </button>
                        {accountOpen && (
                            <div aria-label="Choose an account" className={styles.accountMenu} role="menu">
                                <p className={styles.menuTitle}>Your accounts</p>
                                {accounts.map((item) => (
                                    <button
                                        aria-checked={item.id === selectedAccountId}
                                        className={item.id === selectedAccountId ? styles.accountOptionActive : styles.accountOption}
                                        key={item.id}
                                        onClick={() => {
                                            onSelectAccount(item.id);
                                            setAccountOpen(false);
                                        }}
                                        role="menuitemradio"
                                        type="button"
                                    >
                                        <span className={styles.optionText}>
                                            <strong>{item.name}</strong>
                                            <span>{item.type} ···· {item.lastFour}</span>
                                        </span>
                                        <span className={styles.optionBalance}>{formatMoney(item.available)}</span>
                                        {item.id === selectedAccountId && <FiCheck aria-hidden="true" className={styles.optionCheck} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button aria-label="About this banking demo" className={styles.helpButton} onClick={() => setHelpOpen(true)} type="button">
                        <FiHelpCircle aria-hidden="true" />
                        <span>Demo info</span>
                    </button>
                </div>
            </header>

            <Dialog
                description="Vela is a frontend-only banking preview. It uses sample data and does not connect to a bank."
                onClose={() => setHelpOpen(false)}
                open={helpOpen}
                size="narrow"
                title="A clear demo of digital banking"
            >
                <div className={styles.helpContent}>
                    <p>Try account activity, move money between sample accounts, manage demo cards, and build savings goals.</p>
                    <p>No real funds move, no cards are issued, and changes reset when you refresh this page.</p>
                    <button className={styles.helpDone} data-initial-focus onClick={() => setHelpOpen(false)} type="button">Got it</button>
                </div>
            </Dialog>
        </>
    );
};

export default Header;