import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md';
    isLoading?: boolean;
}

const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            disabled={disabled || isLoading}
            className={clsx(
                'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed',
                {
                    'bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold': variant === 'primary',
                    'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700': variant === 'secondary',
                    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20': variant === 'danger',
                    'hover:bg-slate-800 text-slate-400 hover:text-slate-100': variant === 'ghost',
                    'px-4 py-2.5 text-sm': size === 'md',
                    'px-3 py-1.5 text-xs': size === 'sm',
                },
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
