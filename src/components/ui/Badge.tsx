import { clsx } from 'clsx';

type BadgeVariant = 'active' | 'completed' | 'on_hold' | 'cancelled' | 'low' | 'medium' | 'high' | 'default';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const Badge = ({ label, variant = 'default' }: BadgeProps) => (
    <span className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono border',
        VARIANT_STYLES[variant]
    )}>
        {label.replace('_', ' ')}
    </span>
);

export default Badge;