import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CheckCircle, Circle, Loader, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/format';
import type { Phase } from '../../types/phases.types';


interface PhaseTimelineProps {
    phases: Phase[];
    onEdit: (phase: Phase) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Phase['status']) => void;
}

const STATUS_ICON = {
    completed: { icon: CheckCircle, className: 'text-emerald-400' },
    in_progress: { icon: Loader, className: 'text-amber-400 animate-spin' },
    pending: { icon: Circle, className: 'text-slate-600' },
};

const STATUS_LINE = {
    completed: 'bg-emerald-400',
    in_progress: 'bg-amber-400',
    pending: 'bg-slate-700',
};

const NEXT_STATUS: Record<Phase['status'], Phase['status']> = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending',
};

const STATUS_LABEL: Record<Phase['status'], string> = {
    pending: 'Mark in progress',
    in_progress: 'Mark completed',
    completed: 'Reset to pending',
};

const PhaseNode = ({
    phase,
    index,
    isLast,
    onEdit,
    onDelete,
    onStatusChange,
}: {
    phase: Phase;
    index: number;
    isLast: boolean;
    onEdit: (phase: Phase) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Phase['status']) => void;
}) => {
    const [expanded, setExpanded] = useState(true);
    const { icon: Icon, className: iconClass } = STATUS_ICON[phase.status];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            className="flex gap-4"
        >
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
                {/* Node circle */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStatusChange(phase.id, NEXT_STATUS[phase.status])}
                    title={STATUS_LABEL[phase.status]}
                    className="shrink-0 mt-1 cursor-pointer"
                >
                    <Icon size={22} className={iconClass} />
                </motion.button>

                {/* Connector line */}
                {!isLast && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        style={{ originY: 0 }}
                        className={clsx('w-0.5 flex-1 mt-2 mb-0 min-h-[2rem]', STATUS_LINE[phase.status])}
                    />
                )}
            </div>

            {/*Phase card */}
            <div className="flex-1 pb-8">
                <div className={clsx(
                    'bg-slate-800/50 border rounded-xl p-4 transition-colors',
                    phase.status === 'in_progress'
                        ? 'border-amber-400/30 bg-amber-400/5'
                        : phase.status === 'completed'
                            ? 'border-emerald-500/20'
                            : 'border-slate-700/50'
                )}>
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs text-slate-500">
                                    Phase {phase.order_index}
                                </span>
                                <Badge
                                    label={phase.status}
                                    variant={
                                        phase.status === 'completed' ? 'completed' :
                                            phase.status === 'in_progress' ? 'active' : 'default'
                                    }
                                />
                                {phase.due_date && (
                                    <span className="font-mono text-xs text-slate-500">
                                        Due {formatDate(phase.due_date)}
                                    </span>
                                )}
                            </div>
                            <h4 className="font-display font-semibold text-slate-100 mt-1">
                                {phase.title}
                            </h4>
                        </div>

                        {/* Actions*/}
                        <div className="flex items-center gap-1 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded((e) => !e)}
                                className="text-slate-500"
                            >
                                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(phase)}>
                                <Pencil size={14} />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => onDelete(phase.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>

                    {/* Expandable description */}
                    <motion.div
                        initial={false}
                        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        {phase.description && (
                            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                                {phase.description}
                            </p>
                        )}

                        {/*Status cycle hint*/}
                        <p className="text-slate-600 text-xs font-mono mt-3">
                            ↑ Click the icon to update status
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const PhaseTimeline = ({ phases, onEdit, onDelete, onStatusChange }: PhaseTimelineProps) => {
    if (phases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <Circle size={20} className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-mono text-sm">No phases yet</p>
                <p className="text-slate-600 text-xs">Add a phase to get started</p>
            </div>
        );
    }

    return (
        <div className="pt-2">
            {phases.map((phase, i) => (
                <PhaseNode
                    key={phase.id}
                    phase={phase}
                    index={i}
                    isLast={i === phases.length - 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
};

export default PhaseTimeline;