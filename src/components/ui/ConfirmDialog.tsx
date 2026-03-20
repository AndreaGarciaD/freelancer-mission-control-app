import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmDialog = ({
    isOpen, title, message,
    confirmLabel = 'Delete',
    onConfirm, onCancel,
    isLoading,
}: ConfirmDialogProps) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onCancel}
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
                />

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle size={18} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-slate-100 text-lg">
                                    {title}
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </>
        )}
    </AnimatePresence>
);

export default ConfirmDialog;