import api from './axios';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types';

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
}

export const registerRequest = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
}

export const getMeRequest = async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
};