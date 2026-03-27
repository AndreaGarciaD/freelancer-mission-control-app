import api from './axios';
import type { Project, ProjectPayload, ProjectsResponse, ProjectFilters } from '../types/project.types';

export const fetchProjects = async (params: ProjectFilters): Promise<ProjectsResponse> => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );

    const { data } = await api.get<ProjectsResponse>('/projects', { params: cleanParams });
    return data;
};

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

export const fetchProjectById = async (id: number): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
};
