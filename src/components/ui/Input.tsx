import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 transition-colors',
                            error
                                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20',
                            icon ? 'pl-9' : '',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-400 font-mono">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;