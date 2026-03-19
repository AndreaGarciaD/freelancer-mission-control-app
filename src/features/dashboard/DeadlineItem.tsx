import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Badge from '../../components/ui/Badge';
import type { Project } from '../../types/project.types';
import { formatDeadLineStatus, formatRelative } from '../../utils/format';

interface DeadlineItemProps {
    project: Project;
    index: number;
}

const DeadlineItem = ({ project, index }: DeadlineItemProps) => {
    const deadlineStatus = project.deadline
        ? formatDeadLineStatus(project.deadline)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0 group"
        >
            <div className="flex items-center gap-3 min-w-0">
                {/* Urgency dot */}
                <div className={clsx(
                    'w-2 h-2 rounded-full shrink-0',
                    deadlineStatus?.variant === 'danger' && 'bg-red-400',
                    deadlineStatus?.variant === 'warning' && 'bg-amber-400',
                    deadlineStatus?.variant === 'normal' && 'bg-slate-600',
                )} />
                <div className="min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">
                        {project.title}
                    </p>
                    {project.client_name && (
                        <p className="text-slate-500 text-xs truncate">{project.client_name}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-4">
                <Badge label={project.priority} variant={project.priority} />
                <span className={clsx(
                    'text-xs font-mono',
                    deadlineStatus?.variant === 'danger' && 'text-red-400',
                    deadlineStatus?.variant === 'warning' && 'text-amber-400',
                    deadlineStatus?.variant === 'normal' && 'text-slate-400',
                )}>
                    {project.deadline ? formatRelative(project.deadline) : '—'}
                </span>
            </div>
        </motion.div>
    );
};

export default DeadlineItem;