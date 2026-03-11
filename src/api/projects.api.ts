import api from './axios';
import type { Project, ProjectPayload, ProjectsResponse, ProjectFilters } from '../types/project.types';

export const fetchProjects = async (filters: ProjectFilters): Promise<ProjectsResponse> => {
    const { data } = await api.get<ProjectsResponse>('/projects', { params: filters });
    return data;
}

export const createProject = async (payload: ProjectPayload): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
}

export const updateProject = async (id: number, payload: ProjectPayload): Promise<Project> => {
    const { data } = await api.put<Project>(`/projects/${id}`, payload);
    return data;
}

export const deleteProject = async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
}
