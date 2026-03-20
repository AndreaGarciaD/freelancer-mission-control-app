import { useState, useEffect, useCallback } from 'react';
import { fetchClients, createClient, updateClient, deleteClient } from '../api/clients.api';
import { usePagination } from './usePagination';
import { useToast } from '../store/toast.store';
import type { Client, ClientPayload } from '../types/client.types';
import { useDebouncer } from './useDebounce';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Confirm dialog state
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toast = useToast();
    const debouncedSearch = useDebouncer(search, 400);
    const pagination = usePagination({ initialLimit: 10 });

    useEffect(() => {
        pagination.resetPage();
    }, [debouncedSearch]);

    const loadClients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchClients({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
            });
            setClients(response.data);
            setTotal(response.total);
        } catch {
            setError('Failed to load clients');
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch]);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    const handleCreate = useCallback(async (payload: ClientPayload) => {
        await createClient(payload);
        await loadClients();
        setIsModalOpen(false);
        toast.success('Client created successfully');
    }, [loadClients]);

    const handleUpdate = useCallback(async (id: number, payload: ClientPayload) => {
        await updateClient(id, payload);
        await loadClients();
        setIsModalOpen(false);
        setEditingClient(null);
        toast.success('Client updated successfully');
    }, [loadClients]);

    const confirmDelete = useCallback((id: number) => {
        setDeletingId(id);
    }, []);

    const handleDelete = useCallback(async () => {
        if (deletingId === null) return;
        setIsDeleting(true);
        try {
            await deleteClient(deletingId);
            await loadClients();
            toast.success('Client deleted');
        } catch {
            toast.error('Failed to delete client');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    }, [deletingId, loadClients]);

    const cancelDelete = useCallback(() => setDeletingId(null), []);

    const openCreateModal = useCallback(() => {
        setEditingClient(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingClient(null);
    }, []);

    return {
        clients, total, isLoading, error,
        search, setSearch,
        pagination,
        isModalOpen, editingClient,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate,
        confirmDelete, handleDelete, cancelDelete,
        deletingId, isDeleting,
    };
};