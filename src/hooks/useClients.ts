import { useState, useEffect, useCallback } from 'react';
import { fetchClients, createClient, updateClient, deleteClient } from '../api/clients.api';
import { usePagination } from './usePagination';
import type { Client, ClientPayload } from '../types/client.types';
import { useDebouncer } from './useDebounce';


export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    //modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const debouncedSearch = useDebouncer(search, 500);
    const pagination = usePagination({ initialLimit: 10 });

    //reset to page 1 when search changes
    useEffect(() => {
        pagination.resetPage();
    }, [debouncedSearch, pagination]);

    //fetch clients
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

    //CRUD
    const handleCreate = useCallback(async (payload: ClientPayload) => {
        await createClient(payload);
        await loadClients();
        setIsModalOpen(false);
    }, [loadClients]);

    const handleUpdate = useCallback(async (id: number, payload: ClientPayload) => {
        await updateClient(id, payload);
        await loadClients();
        setEditingClient(null);
        setIsModalOpen(false);
    }, [loadClients]);

    const handleDelete = useCallback(async (id: number) => {
        await deleteClient(id);
        await loadClients();
    }, [loadClients]);

    //modal handlers
    const openCreateModal = useCallback(() => {
        setEditingClient(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setEditingClient(null);
        setIsModalOpen(false);
    }, []);

    return {
        //data
        clients,
        total,
        isLoading,
        error,

        //search
        search,
        setSearch,

        //pagination
        pagination,

        //modal
        isModalOpen,
        editingClient,
        openCreateModal,
        openEditModal,
        closeModal,

        //actions
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}