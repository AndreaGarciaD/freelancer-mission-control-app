import type { Phase, PhasePayload } from '../types/phases.types';
import api from './axios';


export const fetchPhases = async (projectId: number): Promise<Phase[]> => {
    const { data } = await api.get<Phase[]>(`/projects/${projectId}/phases`);
    return data;
};

export const createPhase = async (projectId: number, payload: PhasePayload): Promise<Phase> => {
    const { data } = await api.post<Phase>(`/projects/${projectId}/phases`, payload);
    return data;
};

export const updatePhase = async (id: number, projectId: number, payload: Partial<PhasePayload>): Promise<Phase> => {
    const { data } = await api.put<Phase>(`/projects/${projectId}/phases/${id}`, payload);
    return data;
};

export const deletePhase = async (id: number, projectId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/phases/${id}`);
}