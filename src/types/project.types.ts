export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface Project {
    id: number;
    user_id: number;
    client_id: number | null;
    client_name: string | null;
    title: string;
    description: string | null;
    status: ProjectStatus;
    deadline: string | null;
    rate: number | null;
    budget: number | null;
    priority: ProjectPriority;
    created_at: string;
    updated_at: string;
}

export interface ProjectPayload {
    client_id?: number | null;
    title: string;
    description?: string;
    status: ProjectStatus;
    deadline?: string;
    rate?: number;
    budget?: number;
    priority: ProjectPriority;
}

export interface ProjectsResponse {
    data: Project[];
    total: number;
    page: number;
    limit: number;
}

export interface ProjectFilters {
    status?: ProjectStatus | '';
    priority?: ProjectPriority | '';
    page?: number;
    limit?: number;
    search?: string;
}