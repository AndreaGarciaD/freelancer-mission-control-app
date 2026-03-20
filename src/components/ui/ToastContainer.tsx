import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toast.store';
import { clsx } from 'clsx';

const VARIANT_STYLES = {
    success: {
        container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        icon: CheckCircle,
    },
    error: {
        container: 'bg-red-500/10 border-red-500/20 text-red-400',
        icon: XCircle,
    },
    warning: {
        container: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        icon: AlertTriangle,
    },
    info: {
        container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        icon: Info,
    },
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => {
                    const { container, icon: Icon } = VARIANT_STYLES[toast.variant];
                    return (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 16, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className={clsx(
                                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm min-w-72 max-w-sm shadow-xl',
                                container
                            )}
                        >
                            <Icon size={16} className="shrink-0" />
                            <p className="text-sm font-mono flex-1">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;