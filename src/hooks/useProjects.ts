import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects.api';
import { usePagination } from './usePagination';
import { useToast } from '../store/toast.store';
import type { Project, ProjectPayload, ProjectStatus, ProjectPriority } from '../types/project.types';
import { useDebouncer } from './useDebounce';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
    const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | ''>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toast = useToast();
    const debouncedSearch = useDebouncer(search, 400);
    const pagination = usePagination({ initialLimit: 10 });

    useEffect(() => {
        pagination.resetPage();
    }, [debouncedSearch, statusFilter, priorityFilter]);

    const loadProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchProjects({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                status: statusFilter,
                priority: priorityFilter,
            });
            setProjects(response.data);
            setTotal(response.total);
        } catch {
            setError('Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, priorityFilter]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleCreate = useCallback(async (payload: ProjectPayload) => {
        await createProject(payload);
        await loadProjects();
        setIsModalOpen(false);
        toast.success('Project created successfully');
    }, [loadProjects]);

    const handleUpdate = useCallback(async (id: number, payload: ProjectPayload) => {
        await updateProject(id, payload);
        await loadProjects();
        setIsModalOpen(false);
        setEditingProject(null);
        toast.success('Project updated successfully');
    }, [loadProjects]);

    const confirmDelete = useCallback((id: number) => {
        setDeletingId(id);
    }, []);

    const handleDelete = useCallback(async () => {
        if (deletingId === null) return;
        setIsDeleting(true);
        try {
            await deleteProject(deletingId);
            await loadProjects();
            toast.success('Project deleted');
        } catch {
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    }, [deletingId, loadProjects]);

    const cancelDelete = useCallback(() => setDeletingId(null), []);

    const openCreateModal = useCallback(() => {
        setEditingProject(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingProject(null);
    }, []);

    return {
        projects, total, isLoading, error,
        search, setSearch,
        statusFilter, setStatusFilter,
        priorityFilter, setPriorityFilter,
        pagination,
        isModalOpen, editingProject,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate,
        confirmDelete, handleDelete, cancelDelete,
        deletingId, isDeleting,
    };
};