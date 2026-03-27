export type PhaseStatus = 'pending' | 'in_progress' | 'completed';

export interface Phase {
    id: number;
    project_id: number;
    title: string;
    description?: string;
    status: PhaseStatus;
    order_index: number;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

export interface PhasePayload {
    title: string;
    description?: string;
    status?: PhaseStatus;
    order_index?: number;
    due_date?: string;
}