export interface Client {
    id: number;
    user_id: number;
    name: string;
    email: string | null;
    company: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ClientPayload {
    name: string;
    email?: string;
    company?: string;
    notes?: string;
}

export interface ClientsResponse {
    data: Client[];
    total: number;
    page: number;
    limit: number;
}