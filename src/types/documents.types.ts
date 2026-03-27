export type DocumentType = 'doc' | 'meeting' | 'design' | 'other';

export interface ProjectDocument {
    id: number;
    project_id: number;
    title: string;
    url: string;
    type: DocumentType;
    created_at: string;
    updated_at: string;
}

export interface DocumentPayload {
    title: string;
    url: string;
    type?: DocumentType;
}