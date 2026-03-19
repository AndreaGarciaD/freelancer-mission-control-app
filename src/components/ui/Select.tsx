import { clsx } from 'clsx';
import { forwardRef, type SelectHTMLAttributes } from 'react';


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={clsx(
                        'w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer',
                        error
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-slate-100'
                            : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400/20 text-slate-100',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className="bg-slate-800 text-slate-400">
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-800">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-xs text-red-400 font-mono">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
export default Select;