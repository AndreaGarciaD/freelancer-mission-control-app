import { useState, useEffect, useMemo } from 'react';
import { fetchProjects } from '../api/projects.api';
import { fetchClients } from '../api/clients.api';
import type { Project } from '../types/project.types';
import type { Client } from '../types/client.types';
import { isOverdue, isDueSoon } from '../utils/format';

export const useDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [projectsRes, clientsRes] = await Promise.all([
                    fetchProjects({ page: 1, limit: 100 }),
                    fetchClients({ page: 1, limit: 100 }),
                ]);
                setProjects(projectsRes.data);
                setClients(clientsRes.data);
            } catch {
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);


    const stats = useMemo(() => {
        const activeProjects = projects.filter((p) => p.status === 'active');
        const overdueProjects = projects.filter(
            (p) => p.deadline && isOverdue(p.deadline) && p.status !== 'completed' && p.status !== 'cancelled'
        );
        const dueSoonProjects = projects.filter(
            (p) => p.deadline && isDueSoon(p.deadline) && p.status === 'active'
        );
        const totalBudget = projects
            .filter((p) => p.status === 'active' && p.budget)
            .reduce((sum, p) => sum + (p.budget ?? 0), 0);

        return {
            totalClients: clients.length,
            activeProjects: activeProjects.length,
            overdueCount: overdueProjects.length,
            dueSoonCount: dueSoonProjects.length,
            totalBudget,
        };
    }, [projects, clients]);


    const upcomingDeadlines = useMemo(() => {
        return projects
            .filter((p) => p.deadline && p.status === 'active')
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
            .slice(0, 6);
    }, [projects]);


    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [projects]);

    return {
        stats,
        upcomingDeadlines,
        recentProjects,
        isLoading,
        error,
    };
};