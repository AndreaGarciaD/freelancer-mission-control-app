import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { fetchClients } from '../../api/clients.api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import type { Client } from '../../types/client.types';
import type { Project, ProjectPayload } from '../../types/project.types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './project.constants';

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    client_id: z.number().nullable().optional(),
    status: z.enum(['active', 'completed', 'on_hold', 'cancelled']),
    priority: z.enum(['low', 'medium', 'high']),
    deadline: z.string().optional(),
    description: z.string().optional(),
    rate: z.preprocess((v) => (v === '' ? null : Number(v)), z.number().nullable().optional()),
    budget: z.preprocess((v) => (v === '' ? null : Number(v)), z.number().nullable().optional()),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    onSubmit: (payload: ProjectPayload) => Promise<void>;
    defaultValues?: Project | null;
    isLoading?: boolean;
}

const ProjectForm = ({ onSubmit, defaultValues, isLoading }: ProjectFormProps) => {
    const [clients, setClients] = useState<Client[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: 'active',
            priority: 'medium',
        },
    });

    // Load clients for the dropdown
    useEffect(() => {
        fetchClients({ page: 1, limit: 100 })
            .then((res) => setClients(res.data))
            .catch(() => setClients([]));
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (defaultValues) {
            reset({
                title: defaultValues.title,
                client_id: defaultValues.client_id ?? null,
                status: defaultValues.status,
                priority: defaultValues.priority,
                deadline: defaultValues.deadline
                    ? defaultValues.deadline.split('T')[0]
                    : '',
                description: defaultValues.description ?? '',
                rate: defaultValues.rate ?? undefined,
                budget: defaultValues.budget ?? undefined,
            });
        } else {
            reset({
                title: '', client_id: null, status: 'active',
                priority: 'medium', deadline: '', description: '',
                rate: undefined, budget: undefined,
            });
        }
    }, [defaultValues, reset]);

    const clientOptions = clients.map((c) => ({
        value: String(c.id),
        label: c.company ? `${c.name} — ${c.company}` : c.name,
    }));

    const handleFormSubmit = (data: ProjectFormData) => {
        onSubmit({
            ...data,
            client_id: data.client_id ?? null,
            description: data.description ?? '',
            deadline: data.deadline ?? '',
            rate: data.rate ?? null,
            budget: data.budget ?? null,
        } as ProjectPayload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
                label="Title"
                placeholder="Website redesign"
                error={errors.title?.message}
                {...register('title')}
            />

            {/* Client selector */}
            <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Client
                </label>
                <select
                    {...register('client_id', {
                        setValueAs: (v) => (v === '' ? null : Number(v)),
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors appearance-none cursor-pointer"
                >
                    <option value="" className="bg-slate-800 text-slate-400">
                        No client
                    </option>
                    {clientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-800">
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Status"
                    options={STATUS_OPTIONS}
                    error={errors.status?.message}
                    {...register('status')}
                />
                <Select
                    label="Priority"
                    options={PRIORITY_OPTIONS}
                    error={errors.priority?.message}
                    {...register('priority')}
                />
            </div>

            <Input
                label="Deadline"
                type="date"
                error={errors.deadline?.message}
                {...register('deadline')}
            />

            {/* Rate + Budget row */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Rate ($/hr)"
                    type="number"
                    placeholder="0.00"
                    {...register('rate')}
                />
                <Input
                    label="Budget ($)"
                    type="number"
                    placeholder="0.00"
                    {...register('budget')}
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    placeholder="Project details..."
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors resize-none"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" isLoading={isLoading}>
                    {defaultValues ? 'Save changes' : 'Create project'}
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;