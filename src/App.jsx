import { useCallback, useState } from "react";
import AppRoutes from "./AppRoutes";
import styles from "./App.module.css";
import Footer from "./components/footer";
import Header from "./components/header";
import Navigation from "./components/navigation";
import Toast from "./components/toast";
import useBankingState from "./hooks/useBankingState";

const App = () => {
    const [selectedAccountId, setSelectedAccountId] = useState("everyday");
    const [toast, setToast] = useState(null);
    const notify = useCallback((message, type = "success") => {
        setToast({ message, type, id: Date.now() });
    }, []);
    const dismissToast = useCallback(() => setToast(null), []);
    const banking = useBankingState(notify);

    return (
        <div className={styles.app}>
            <a className={styles.skipLink} href="#main-content">Skip to main content</a>
            <Header
                accounts={banking.accounts}
                onSelectAccount={setSelectedAccountId}
                selectedAccountId={selectedAccountId}
            />
            <main className={styles.main} id="main-content">
                <Navigation />
                <AppRoutes
                    banking={banking}
                    onSelectAccount={setSelectedAccountId}
                    notify={notify}
                    selectedAccountId={selectedAccountId}
                    totalBalance={banking.totalBalance}
                />
            </main>
            <Footer />
            <Toast key={toast?.id || "empty"} message={toast?.message} onDismiss={dismissToast} type={toast?.type} />
        </div>
    );
};

export default App;