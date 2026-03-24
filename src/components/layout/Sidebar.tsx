import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FolderKanban, Terminal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/auth.store';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();
    const location = useLocation();

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative flex flex-col h-screen bg-slate-900 border-r border-slate-800 shrink-0"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0 overflow-hidden">
                <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center shrink-0">
                    <Terminal size={16} className="text-slate-950" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <p className="font-display font-semibold text-slate-100 text-sm leading-none whitespace-nowrap">
                                Mission Control
                            </p>
                            <p className="font-mono text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">
                                FREELANCER OS
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                    const isActive = location.pathname === to;
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            className={clsx(
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                                isActive
                                    ? 'text-slate-950'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-amber-400 rounded-lg"
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                />
                            )}
                            <Icon
                                size={18}
                                className={clsx(
                                    'relative z-10 shrink-0',
                                    isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-100'
                                )}
                            />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className={clsx(
                                            'relative z-10 text-sm font-medium whitespace-nowrap',
                                            isActive ? 'text-slate-950' : ''
                                        )}
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    );
                })}

                {/* Collapse toggle*/}
                <div className="pt-2 mt-2 border-t border-slate-800">
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                    >
                        <div className="shrink-0">
                            {collapsed
                                ? <PanelLeftOpen size={18} />
                                : <PanelLeftClose size={18} />
                            }
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    Close
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </nav>

            {/* User info */}
            <div className="px-2 py-4 border-t border-slate-800 overflow-hidden">
                <div className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    collapsed ? 'justify-center' : ''
                )}>
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <span className="text-amber-400 font-mono text-xs font-bold">
                            {user?.name?.charAt(0).toUpperCase() ?? '?'}
                        </span>
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <p className="text-slate-200 text-xs font-medium whitespace-nowrap truncate max-w-[130px]">
                                    {user?.name ?? 'User'}
                                </p>
                                <p className="text-slate-500 text-[10px] font-mono whitespace-nowrap truncate max-w-[130px]">
                                    {user?.email ?? ''}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;