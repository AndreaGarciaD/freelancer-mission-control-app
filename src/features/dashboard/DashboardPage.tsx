import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users, FolderKanban, AlertTriangle,
    Clock, DollarSign, ArrowRight,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency, formatDate } from '../../utils/format';
import MetricCard from './MetricCard';
import DeadlineItem from './DeadlineItem';
import DashboardSkeleton from './DashboardSkeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
    const { stats, upcomingDeadlines, recentProjects, isLoading, error } = useDashboard();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    if (isLoading) return <DashboardSkeleton />;

    if (error) return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="font-display text-xl font-semibold text-slate-100">
                    {greeting}, {user?.name?.split(' ')[0]}.
                </h2>
                <p className="text-slate-500 font-mono text-xs mt-1">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric',
                        month: 'long', day: 'numeric',
                    })}
                </p>
            </motion.div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <MetricCard
                    label="Total Clients"
                    value={stats.totalClients}
                    icon={Users}
                    variant="default"
                    delay={0.05}
                />
                <MetricCard
                    label="Active Projects"
                    value={stats.activeProjects}
                    icon={FolderKanban}
                    variant="success"
                    delay={0.1}
                />
                <MetricCard
                    label="Overdue"
                    value={stats.overdueCount}
                    icon={AlertTriangle}
                    variant={stats.overdueCount > 0 ? 'danger' : 'default'}
                    delay={0.15}
                />
                <MetricCard
                    label="Active Budget"
                    value={formatCurrency(stats.totalBudget)}
                    icon={DollarSign}
                    variant="warning"
                    delay={0.2}
                />
            </div>

            {/* Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

                {/* Upcoming deadlines */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-amber-400" />
                            <h3 className="font-display font-semibold text-slate-100">
                                Upcoming Deadlines
                            </h3>
                        </div>
                        {stats.dueSoonCount > 0 && (
                            <span className="font-mono text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                                {stats.dueSoonCount} due soon
                            </span>
                        )}
                    </div>

                    {upcomingDeadlines.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <Clock size={24} className="text-slate-700" />
                            <p className="text-slate-600 font-mono text-xs">No upcoming deadlines</p>
                        </div>
                    ) : (
                        upcomingDeadlines.map((project, i) => (
                            <DeadlineItem key={project.id} project={project} index={i} />
                        ))
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-full justify-center gap-1 text-slate-500 hover:text-amber-400"
                        onClick={() => navigate('/projects')}
                    >
                        View all projects <ArrowRight size={13} />
                    </Button>
                </motion.div>

                {/* Recent projects */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FolderKanban size={16} className="text-amber-400" />
                        <h3 className="font-display font-semibold text-slate-100">
                            Recent Projects
                        </h3>
                    </div>

                    {recentProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <FolderKanban size={24} className="text-slate-700" />
                            <p className="text-slate-600 font-mono text-xs">No projects yet</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {recentProjects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.06 }}
                                    className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="text-slate-200 text-sm font-medium truncate">
                                            {project.title}
                                        </p>
                                        <p className="text-slate-500 text-xs font-mono mt-0.5">
                                            {project.client_name ?? 'No client'} · {formatDate(project.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 shrink-0">
                                        <Badge label={project.status} variant={project.status} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-full justify-center gap-1 text-slate-500 hover:text-amber-400"
                        onClick={() => navigate('/clients')}
                    >
                        View all clients <ArrowRight size={13} />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;