import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Pencil, FolderKanban } from 'lucide-react';
import { useMemo } from 'react';
import { useProjects } from '../../hooks/useProjects';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import { SkeletonRow } from '../../components/ui/Skeleton';
import ProjectForm from './ProjectForm';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './project.constants';
import type { ProjectPayload, ProjectStatus, ProjectPriority } from '../../types/project.types';
import { clsx } from 'clsx';
import { formatDeadLineStatus } from '../../utils/format';

const FILTER_STATUS_OPTIONS = [{ value: '', label: 'All statuses' }, ...STATUS_OPTIONS];
const FILTER_PRIORITY_OPTIONS = [{ value: '', label: 'All priorities' }, ...PRIORITY_OPTIONS];

const ProjectsPage = () => {
    const {
        projects, total, isLoading, error,
        search, setSearch,
        statusFilter, setStatusFilter,
        priorityFilter, setPriorityFilter,
        pagination,
        isModalOpen, editingProject,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate, handleDelete,
    } = useProjects();

    const totalPages = useMemo(
        () => pagination.totalPages(total),
        [total, pagination]
    );

    const onSubmit = async (payload: ProjectPayload) => {
        if (editingProject) {
            await handleUpdate(editingProject.id, payload);
        } else {
            await handleCreate(payload);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="w-64">
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={15} />}
                    />
                </div>
                <Select
                    options={FILTER_STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
                    className="w-40"
                />
                <Select
                    options={FILTER_PRIORITY_OPTIONS}
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | '')}
                    className="w-40"
                />
                <div className="ml-auto">
                    <Button onClick={openCreateModal}>
                        <Plus size={16} />
                        New project
                    </Button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm font-mono">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1.5fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-800 bg-slate-950/50">
                    {['Title', 'Client', 'Status', 'Priority', 'Deadline', 'Actions'].map((col) => (
                        <span key={col} className="font-mono text-xs text-slate-500 uppercase tracking-wider">
                            {col}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                            <FolderKanban size={20} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-mono text-sm">No projects found</p>
                        {(search || statusFilter || priorityFilter) && (
                            <p className="text-slate-600 text-xs">Try adjusting your filters</p>
                        )}
                    </div>
                ) : (
                    projects.map((project, i) => {
                        const deadlineStatus = project.deadline
                            ? formatDeadLineStatus(project.deadline)
                            : null;

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="grid grid-cols-[1.5fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors items-center group"
                            >
                                <div>
                                    <p className="text-slate-100 text-sm font-medium truncate">
                                        {project.title}
                                    </p>
                                    {project.description && (
                                        <p className="text-slate-600 text-xs truncate mt-0.5">
                                            {project.description}
                                        </p>
                                    )}
                                </div>

                                <span className="text-slate-400 text-sm truncate">
                                    {project.client_name ?? '—'}
                                </span>

                                <Badge
                                    label={project.status}
                                    variant={project.status}
                                />

                                <Badge
                                    label={project.priority}
                                    variant={project.priority}
                                />

                                <span className={clsx(
                                    'text-xs font-mono whitespace-nowrap',
                                    deadlineStatus?.variant === 'danger' && 'text-red-400',
                                    deadlineStatus?.variant === 'warning' && 'text-amber-400',
                                    deadlineStatus?.variant === 'normal' && 'text-slate-400',
                                    !deadlineStatus && 'text-slate-600'
                                )}>
                                    {deadlineStatus?.label ?? '—'}
                                </span>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditModal(project)}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500">
                    {total} {total === 1 ? 'project' : 'projects'} total
                </p>
                <Pagination
                    page={pagination.page}
                    totalPages={totalPages}
                    onPrev={pagination.prevPage}
                    onNext={pagination.nextPage}
                    onGoTo={pagination.goToPage}
                />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingProject ? 'Edit project' : 'New project'}
            >
                <ProjectForm
                    onSubmit={onSubmit}
                    defaultValues={editingProject}
                />
            </Modal>
        </div>
    );
};

export default ProjectsPage;