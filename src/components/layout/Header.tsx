import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back. Here is your overview.' },
    '/clients': { title: 'Clients', subtitle: 'Manage your client relationships.' },
    '/projects': { title: 'Projects', subtitle: 'Track your active work.' },
};

const Header = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const page = PAGE_TITLES[location.pathname] ?? { title: 'Mission Control', subtitle: '' };

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
            {/* Page title */}
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <h1 className="font-display font-semibold text-slate-100 text-lg leading-none">
                    {page.title}
                </h1>
                <p className="text-slate-500 text-xs mt-0.5 font-mono">{page.subtitle}</p>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors text-sm font-mono"
                >
                    <LogOut size={15} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;