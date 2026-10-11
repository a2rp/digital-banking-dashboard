import { FiArrowLeft, FiCompass } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section className={styles.page}>
        <div aria-hidden="true" className={styles.mark}><FiCompass /></div>
        <p className={styles.code}>404</p>
        <h1>This page is off the map</h1>
        <p className={styles.description}>That Vela destination is unavailable. Head back to your account overview to keep moving.</p>
        <Link className={styles.returnLink} to="/">
            <FiArrowLeft aria-hidden="true" />
            <span>Return to overview</span>
        </Link>
    </section>
);

export default NotFoundPage;
