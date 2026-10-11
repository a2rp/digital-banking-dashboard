import { NavLink } from "react-router-dom";
import { FiActivity, FiCreditCard, FiHome, FiRepeat, FiTarget } from "react-icons/fi";
import styles from "./styles.module.css";

const destinations = [
    { label: "Home", to: "/", end: true, icon: FiHome },
    { label: "Activity", to: "/activity", icon: FiActivity },
    { label: "Move money", to: "/transfers", icon: FiRepeat },
    { label: "Cards", to: "/cards", icon: FiCreditCard },
    { label: "Goals", to: "/goals", icon: FiTarget },
];

const Navigation = () => (
    <nav aria-label="Banking navigation" className={styles.navigation}>
        {destinations.map(({ label, to, end, icon: Icon }) => (
            <NavLink
                aria-label={label}
                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                end={end}
                key={to}
                to={to}
            >
                <Icon aria-hidden="true" />
                <span>{label}</span>
            </NavLink>
        ))}
    </nav>
);

export default Navigation;