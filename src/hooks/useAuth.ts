import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, registerRequest } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginPayload, RegisterPayload } from '../types/auth.types';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth, logout, user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const login = useCallback(async (payload: LoginPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user, token } = await loginRequest(payload);
            setAuth(user, token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    }, [setAuth, navigate]);

    const register = useCallback(async (payload: RegisterPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user, token } = await registerRequest(payload);
            setAuth(user, token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    }, [setAuth, navigate]);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout: handleLogout
    }
}