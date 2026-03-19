import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    variant?: 'default' | 'warning' | 'danger' | 'success';
    delay?: number;
}

const VARIANT_STYLES = {
    default: {
        icon: 'bg-slate-800 text-slate-400',
        value: 'text-slate-100',
    },
    success: {
        icon: 'bg-emerald-500/10 text-emerald-400',
        value: 'text-emerald-400',
    },
    warning: {
        icon: 'bg-amber-500/10 text-amber-400',
        value: 'text-amber-400',
    },
    danger: {
        icon: 'bg-red-500/10 text-red-400',
        value: 'text-red-400',
    },
};

const MetricCard = ({ label, value, icon: Icon, variant = 'default', delay = 0 }: MetricCardProps) => {
    const styles = VARIANT_STYLES[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors"
        >
            <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', styles.icon)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className={clsx('font-display text-2xl font-semibold leading-none', styles.value)}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
};

export default MetricCard;