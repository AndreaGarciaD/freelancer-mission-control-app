import type { DocumentPayload, ProjectDocument } from '../types/documents.types';
import api from './axios';


export const fetchDocuments = async (projectId: number): Promise<ProjectDocument[]> => {
    const { data } = await api.get<ProjectDocument[]>(`/projects/${projectId}/documents`);
    return data;
};

export const createDocument = async (
    projectId: number,
    payload: DocumentPayload
): Promise<ProjectDocument> => {
    const { data } = await api.post<ProjectDocument>(`/projects/${projectId}/documents`, payload);
    return data;
};

export const updateDocument = async (
    projectId: number,
    documentId: number,
    payload: Partial<DocumentPayload>
): Promise<ProjectDocument> => {
    const { data } = await api.put<ProjectDocument>(
        `/projects/${projectId}/documents/${documentId}`,
        payload
    );
    return data;
};

export const deleteDocument = async (
    projectId: number,
    documentId: number
): Promise<void> => {
    await api.delete(`/projects/${projectId}/documents/${documentId}`);
};