import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, DollarSign, User } from 'lucide-react';
import { fetchProjectById } from '../../api/projects.api';
import { usePhases } from '../../hooks/usePhases';
import { useDocuments } from '../../hooks/useDocuments';
import { useToast } from '../../store/toast.store';
import type { Project } from '../../types/project.types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PhaseTimeline from './PhaseTimeline';
import PhaseForm from './PhaseForm';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import { formatDate, formatCurrency } from '../../utils/format';

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [project, setProject] = useState<Project | null>(null);
    const [loadedProjectId, setLoadedProjectId] = useState<number | null>(null);

    const projectId = Number(id);

    // Phases
    const {
        phases, isLoading: isPhasesLoading,
        isModalOpen: isPhaseModalOpen,
        editingPhase,
        openCreateModal: openCreatePhase,
        openEditModal: openEditPhase,
        closeModal: closePhaseModal,
        handleCreate: handleCreatePhase,
        handleUpdate: handleUpdatePhase,
        handleDelete: handleDeletePhase,
        handleStatusChange,
        deletingId: deletingPhaseId,
        setDeletingId: setDeletingPhaseId,
        isDeleting: isDeletingPhase,
    } = usePhases(projectId);

    // Documents
    const {
        documents, isLoading: isDocsLoading,
        isModalOpen: isDocModalOpen,
        editingDocument,
        openCreateModal: openCreateDoc,
        openEditModal: openEditDoc,
        closeModal: closeDocModal,
        handleCreate: handleCreateDoc,
        handleUpdate: handleUpdateDoc,
        handleDelete: handleDeleteDoc,
        deletingId: deletingDocId,
        setDeletingId: setDeletingDocId,
        isDeleting: isDeletingDoc,
    } = useDocuments(projectId);

    useEffect(() => {
        if (!projectId) return;
        fetchProjectById(projectId)
            .then(setProject)
            .catch(() => {
                setProject(null);
                toast.error('Failed to load project');
            })
            .finally(() => setLoadedProjectId(projectId));
    }, [projectId, toast]);

    const isProjectLoading = loadedProjectId !== projectId;

    if (isProjectLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                <div className="h-32 bg-slate-800 rounded-2xl" />
                <div className="h-64 bg-slate-800 rounded-2xl" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-500 font-mono">Project not found</p>
                <Button variant="secondary" onClick={() => navigate('/projects')}>
                    Back to projects
                </Button>
            </div>
        );
    }

    const completedPhases = phases.filter((p) => p.status === 'completed').length;
    const progress = phases.length > 0
        ? Math.round((completedPhases / phases.length) * 100)
        : 0;

    return (
        <div className="w-full px-6">
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:items-start">
                <div className="space-y-6 min-w-0 w-full">
                    {/* Back */}
                    <motion.button
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors font-mono text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to projects
                    </motion.button>

                    {/* Project header */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                    >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h2 className="font-display text-2xl font-semibold text-slate-100">
                                    {project.title}
                                </h2>
                                {project.client_name && (
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                                        <User size={13} />
                                        <span>{project.client_name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge label={project.status} variant={project.status} />
                                <Badge label={project.priority} variant={project.priority} />
                            </div>
                        </div>

                        {project.description && (
                            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                                {project.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-slate-800">
                            {project.deadline && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar size={14} className="text-slate-500" />
                                    <span className="font-mono text-xs text-slate-500">Deadline</span>
                                    <span>{formatDate(project.deadline)}</span>
                                </div>
                            )}
                            {project.budget && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <DollarSign size={14} className="text-slate-500" />
                                    <span className="font-mono text-xs text-slate-500">Budget</span>
                                    <span>{formatCurrency(project.budget)}</span>
                                </div>
                            )}
                            {project.rate && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <DollarSign size={14} className="text-slate-500" />
                                    <span className="font-mono text-xs text-slate-500">Rate</span>
                                    <span>{formatCurrency(project.rate)}/hr</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Phases */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-display font-semibold text-slate-100 text-lg">
                                    Project Phases
                                </h3>
                                {phases.length > 0 && (
                                    <p className="text-slate-500 font-mono text-xs mt-0.5">
                                        {completedPhases} of {phases.length} completed
                                    </p>
                                )}
                            </div>
                            <Button onClick={openCreatePhase} size="sm">
                                <Plus size={14} />
                                Add phase
                            </Button>
                        </div>

                        {phases.length > 0 && (
                            <div className="mb-6">
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                        className="h-full bg-amber-400 rounded-full"
                                    />
                                </div>
                                <p className="text-right font-mono text-xs text-slate-500 mt-1">
                                    {progress}%
                                </p>
                            </div>
                        )}

                        {isPhasesLoading ? (
                            <div className="space-y-4 animate-pulse">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-5 h-5 rounded-full bg-slate-800 mt-1 shrink-0" />
                                        <div className="flex-1 h-20 bg-slate-800 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <PhaseTimeline
                                phases={phases}
                                onEdit={openEditPhase}
                                onDelete={(id) => setDeletingPhaseId(id)}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                    </motion.div>
                </div>

                {/*Documents sidebar*/}
                <div className="space-y-6 lg:sticky lg:top-6">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-display font-semibold text-slate-100 text-lg">
                                    Documents & Links
                                </h3>
                                <p className="text-slate-500 font-mono text-xs mt-0.5">
                                    {documents.length} {documents.length === 1 ? 'file' : 'files'} attached
                                </p>
                            </div>
                            <Button onClick={openCreateDoc} size="sm">
                                <Plus size={14} />
                                Add link
                            </Button>
                        </div>

                        {isDocsLoading ? (
                            <div className="grid grid-cols-1 gap-3 animate-pulse">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-16 bg-slate-800 rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                                <DocumentList
                                    documents={documents}
                                    onEdit={openEditDoc}
                                    onDelete={(id) => setDeletingDocId(id)}
                                    compact
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Phase modal */}
            <Modal
                isOpen={isPhaseModalOpen}
                onClose={closePhaseModal}
                title={editingPhase ? 'Edit phase' : 'New phase'}
            >
                <PhaseForm
                    onSubmit={editingPhase
                        ? (payload) => handleUpdatePhase(editingPhase.id, payload)
                        : handleCreatePhase
                    }
                    defaultValues={editingPhase}
                />
            </Modal>

            {/* Document modal */}
            <Modal
                isOpen={isDocModalOpen}
                onClose={closeDocModal}
                title={editingDocument ? 'Edit document' : 'Add document link'}
            >
                <DocumentForm
                    onSubmit={editingDocument
                        ? (payload) => handleUpdateDoc(editingDocument.id, payload)
                        : handleCreateDoc
                    }
                    defaultValues={editingDocument}
                />
            </Modal>

            {/* Phase confirm delete */}
            <ConfirmDialog
                isOpen={deletingPhaseId !== null}
                title="Delete phase"
                message="This will permanently delete this phase."
                onConfirm={handleDeletePhase}
                onCancel={() => setDeletingPhaseId(null)}
                isLoading={isDeletingPhase}
            />

            {/*document confirm delete */}
            <ConfirmDialog
                isOpen={deletingDocId !== null}
                title="Delete document"
                message="This will remove the link from this project."
                onConfirm={handleDeleteDoc}
                onCancel={() => setDeletingDocId(null)}
                isLoading={isDeletingDoc}
            />
        </div>
    );
};

export default ProjectDetailPage;