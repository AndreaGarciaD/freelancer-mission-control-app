import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, Terminal } from 'lucide-react';


type AuthForm = {
    name?: string;
    email: string;
    password: string;
};

const authSchema = z.object({
    name: z.string().optional(),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const { login, register, isLoading, error } = useAuth();

    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AuthForm>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = (data: AuthForm) => {
        if (mode === 'login') {
            login({ email: data.email, password: data.password });
        } else {
            register({
                name: data.name ?? '',
                email: data.email,
                password: data.password,
            });
        }
    };

    const toggleMode = () => {
        setMode((m) => (m === 'login' ? 'register' : 'login'));
        reset();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            {/* Background grid */}
            <div
                className="fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative"
            >
                {/* Logo mark */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-amber-400 rounded flex items-center justify-center">
                        <Terminal size={20} className="text-slate-950" />
                    </div>
                    <div>
                        <p className="font-display font-700 text-slate-100 text-lg leading-none">Mission Control</p>
                        <p className="font-mono text-xs text-slate-500 mt-0.5">FREELANCER OS v1.0</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'login' ? -12 : 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'login' ? 12 : -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h1 className="font-display text-2xl font-semibold text-slate-100 mb-1">
                                {mode === 'login' ? 'Welcome back' : 'Create account'}
                            </h1>
                            <p className="text-slate-500 text-sm mb-8">
                                {mode === 'login'
                                    ? 'Sign in to your Mission Control dashboard'
                                    : 'Get started managing your freelance business'}
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {mode === 'register' && (
                                    <div>
                                        <label className="block font-mono text-xs text-slate-400 mb-2 uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <input
                                            {...registerField('name')}
                                            placeholder="Alex Johnson"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 font-sans text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.name.message}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block font-mono text-xs text-slate-400 mb-2 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <input
                                        {...registerField('email')}
                                        type="email"
                                        placeholder="alex@studio.com"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 font-sans text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-mono text-xs text-slate-400 mb-2 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <input
                                        {...registerField('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 font-sans text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* API error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 1, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-3"
                                    >
                                        <p className="text-red-300 text-xs font-mono font-medium">{error}</p>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-display font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : mode === 'login' ? (
                                        'Sign in'
                                    ) : (
                                        'Create account'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                        <p className="text-slate-500 text-sm">
                            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={toggleMode}
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                {mode === 'login' ? 'Register' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-700 font-mono text-xs mt-6">
                    MISSION CONTROL © {new Date().getFullYear()}
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;