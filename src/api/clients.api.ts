import api from './axios';
import type { Client, ClientPayload, ClientsResponse } from '../types/client.types';
import type { PaginationParams } from '../types/api.types';

export const fetchClients = async (params: PaginationParams): Promise<ClientsResponse> => {
    const { data } = await api.get<ClientsResponse>('/clients', { params });
    return data;
}

export const createClient = async (payload: ClientPayload): Promise<Client> => {
    const { data } = await api.post<Client>('/clients', payload);
    return data;
}

export const updateClient = async (id: number, payload: ClientPayload): Promise<Client> => {
    const { data } = await api.put<Client>(`/clients/${id}`, payload);
    return data;
}

export const deleteClient = async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
}