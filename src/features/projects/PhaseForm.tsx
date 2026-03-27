import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import type { Phase, PhasePayload } from '../../types/phases.types';


const phaseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']),
    due_date: z.string().optional(),
});

type PhaseFormData = z.infer<typeof phaseSchema>;

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

interface PhaseFormProps {
    onSubmit: (payload: PhasePayload) => Promise<void>;
    defaultValues?: Phase | null;
    isLoading?: boolean;
}

const PhaseForm = ({ onSubmit, defaultValues, isLoading }: PhaseFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PhaseFormData>({
        resolver: zodResolver(phaseSchema),
        defaultValues: { status: 'pending' },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                title: defaultValues.title,
                description: defaultValues.description ?? '',
                status: defaultValues.status,
                due_date: defaultValues.due_date
                    ? defaultValues.due_date.split('T')[0]
                    : '',
            });
        } else {
            reset({ title: '', description: '', status: 'pending', due_date: '' });
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Phase Title"
                placeholder="Design & Wireframing"
                error={errors.title?.message}
                {...register('title')}
            />
            <Select
                label="Status"
                options={STATUS_OPTIONS}
                error={errors.status?.message}
                {...register('status')}
            />
            <Input
                label="Due Date"
                type="date"
                {...register('due_date')}
            />
            <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    placeholder="What does this phase involve?"
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors resize-none"
                />
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading}>
                    {defaultValues ? 'Save changes' : 'Add phase'}
                </Button>
            </div>
        </form>
    );
};

export default PhaseForm;