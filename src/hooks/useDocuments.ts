import { useState, useEffect, useCallback } from 'react';
import {
    fetchDocuments, createDocument,
    updateDocument, deleteDocument,
} from '../api/documents.api';
import { useToast } from '../store/toast.store';
import type { DocumentPayload, ProjectDocument } from '../types/documents.types';


export const useDocuments = (projectId: number) => {
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toast = useToast();

    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchDocuments(projectId);
            setDocuments(data);
        } catch {
            toast.error('Failed to load documents');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleCreate = useCallback(async (payload: DocumentPayload) => {
        try {
            await createDocument(projectId, payload);
            await loadDocuments();
            setIsModalOpen(false);
            toast.success('Document added');
        } catch {
            toast.error('Failed to add document');
        }
    }, [projectId, loadDocuments]);

    const handleUpdate = useCallback(async (id: number, payload: Partial<DocumentPayload>) => {
        try {
            await updateDocument(projectId, id, payload);
            await loadDocuments();
            setIsModalOpen(false);
            setEditingDocument(null);
            toast.success('Document updated');
        } catch {
            toast.error('Failed to update document');
        }
    }, [projectId, loadDocuments]);

    const handleDelete = useCallback(async () => {
        if (deletingId === null) return;
        setIsDeleting(true);
        try {
            await deleteDocument(projectId, deletingId);
            await loadDocuments();
            toast.success('Document deleted');
        } catch {
            toast.error('Failed to delete document');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    }, [projectId, deletingId, loadDocuments]);

    const openCreateModal = useCallback(() => {
        setEditingDocument(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((doc: ProjectDocument) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingDocument(null);
    }, []);

    return {
        documents, isLoading,
        isModalOpen, editingDocument,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate,
        handleDelete, deletingId, setDeletingId, isDeleting,
    };
};