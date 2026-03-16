import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from './PageTransition';

const AppLayout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;