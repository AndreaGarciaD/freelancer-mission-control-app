import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards';
import { PublicRoute } from './guards';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ClientsPage from '../features/clients/ClientsPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import AppLayout from '../components/layout/AppLayout';

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            { path: '/login', element: <LoginPage /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/clients', element: <ClientsPage /> },
                    { path: '/projects', element: <ProjectsPage /> },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);