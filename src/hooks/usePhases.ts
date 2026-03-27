import { useState, useEffect, useCallback } from 'react';
import { fetchPhases, createPhase, updatePhase, deletePhase } from '../api/phases.api';
import { useToast } from '../store/toast.store';
import type { Phase, PhasePayload } from '../types/phases.types';


export const usePhases = (projectId: number) => {
    const [phases, setPhases] = useState<Phase[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toast = useToast();

    const loadPhases = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchPhases(projectId);
            //display sorted by order_index
            setPhases(data.sort((a, b) => a.order_index - b.order_index));
        } catch {
            setError('Failed to load phases');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadPhases();
    }, [loadPhases]);

    const handleCreate = useCallback(async (payload: PhasePayload) => {
        try {
            //auto-assign order_index as next in sequence
            const nextIndex = phases.length > 0
                ? Math.max(...phases.map((p) => p.order_index)) + 1
                : 1;
            await createPhase(projectId, { ...payload, order_index: nextIndex });
            await loadPhases();
            setIsModalOpen(false);
            toast.success('Phase created');
        } catch {
            toast.error('Failed to create phase');
        }
    }, [projectId, phases, loadPhases]);

    const handleUpdate = useCallback(async (id: number, payload: Partial<PhasePayload>) => {
        try {
            await updatePhase(id, projectId,payload);
            await loadPhases();
            setIsModalOpen(false);
            setEditingPhase(null);
            toast.success('Phase updated');
        } catch {
            toast.error('Failed to update phase');
        }
    }, [loadPhases]);

    const handleDelete = useCallback(async () => {
        if (deletingId === null) return;
        setIsDeleting(true);
        try {
            await deletePhase(projectId,deletingId);
            await loadPhases();
            toast.success('Phase deleted');
        } catch {
            toast.error('Failed to delete phase');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    }, [deletingId, loadPhases]);

    const handleStatusChange = useCallback(async (id: number, status: Phase['status']) => {
        try {
            await updatePhase(id, projectId, { status });
            await loadPhases();
            toast.success('Phase status updated');
        } catch {
            toast.error('Failed to update status');
        }
    }, [loadPhases]);

    const openCreateModal = useCallback(() => {
        setEditingPhase(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((phase: Phase) => {
        setEditingPhase(phase);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingPhase(null);
    }, []);

    return {
        phases, isLoading, error,
        isModalOpen, editingPhase,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate, handleDelete, handleStatusChange,
        deletingId, setDeletingId, isDeleting,
    };
};