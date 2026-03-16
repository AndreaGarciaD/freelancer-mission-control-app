import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Client, ClientPayload } from '../../types/client.types';

const clientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    company: z.string().optional(),
    notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
    onSubmit: (payload: ClientPayload) => Promise<void>;
    defaultValues?: Client | null;
    isLoading?: boolean;
}

const ClientForm = ({ onSubmit, defaultValues, isLoading }: ClientFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                name: defaultValues.name,
                email: defaultValues.email ?? '',
                company: defaultValues.company ?? '',
                notes: defaultValues.notes ?? '',
            });
        } else {
            reset({ name: '', email: '', company: '', notes: '' });
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Name"
                placeholder="Jane Smith"
                error={errors.name?.message}
                {...register('name')}
            />
            <Input
                label="Email"
                type="email"
                placeholder="jane@company.com"
                error={errors.email?.message}
                {...register('email')}
            />
            <Input
                label="Company"
                placeholder="Acme Corp"
                {...register('company')}
            />
            <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Notes
                </label>
                <textarea
                    {...register('notes')}
                    placeholder="Any relevant notes..."
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors resize-none"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" isLoading={isLoading}>
                    {defaultValues ? 'Save changes' : 'Create client'}
                </Button>
            </div>
        </form>
    );
};

export default ClientForm;