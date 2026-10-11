import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import ScrollToTop from "./components/scrollToTop";

const HomePage = lazy(() => import("./pages/home/index.jsx"));
const ActivityPage = lazy(() => import("./pages/activity/index.jsx"));
const TransfersPage = lazy(() => import("./pages/transfers/index.jsx"));
const CardsPage = lazy(() => import("./pages/cards/index.jsx"));
const GoalsPage = lazy(() => import("./pages/goals/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({ banking, notify, onSelectAccount, selectedAccountId, totalBalance }) => {
    const location = useLocation();
    const pageProps = { ...banking, notify, onSelectAccount, selectedAccountId, totalBalance };

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loading />} key={location.pathname}>
                <Routes location={location}>
                    <Route element={<HomePage {...pageProps} />} path="/" />
                    <Route element={<ActivityPage {...pageProps} />} path="/activity" />
                    <Route element={<TransfersPage {...pageProps} />} path="/transfers" />
                    <Route element={<CardsPage {...pageProps} />} path="/cards" />
                    <Route element={<GoalsPage {...pageProps} />} path="/goals" />
                    <Route element={<NotFoundPage />} path="*" />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;