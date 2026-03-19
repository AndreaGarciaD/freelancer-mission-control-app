import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects.api';
import { usePagination } from './usePagination';
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

    //modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const debouncedSearch = useDebouncer(search, 400);
    const pagination = usePagination({ initialLimit: 10 });

    //reset to page 1 on filter/search change
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
            console.log('search:', debouncedSearch, 'status:', statusFilter, 'priority:', priorityFilter);
            console.log('Fetched projects:', response.data);
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

    //CRUD
    const handleCreate = useCallback(async (payload: ProjectPayload) => {
        await createProject(payload);
        await loadProjects();
        setIsModalOpen(false);
    }, [loadProjects]);

    const handleUpdate = useCallback(async (id: number, payload: ProjectPayload) => {
        await updateProject(id, payload);
        await loadProjects();
        setIsModalOpen(false);
        setEditingProject(null);
    }, [loadProjects]);

    const handleDelete = useCallback(async (id: number) => {
        await deleteProject(id);
        await loadProjects();
    }, [loadProjects]);

    //modal helpers
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
        //data
        projects,
        total,
        isLoading,
        error,

        //filters
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,

        //pagination
        pagination,

        //modal
        isModalOpen,
        editingProject,
        openCreateModal,
        openEditModal,
        closeModal,

        //actions
        handleCreate,
        handleUpdate,
        handleDelete,
    };
};