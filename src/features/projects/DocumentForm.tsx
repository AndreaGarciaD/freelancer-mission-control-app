import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import type { DocumentPayload, ProjectDocument } from '../../types/documents.types';


const documentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Must be a valid URL (include https://)'),
    type: z.enum(['doc', 'meeting', 'design', 'other']),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const TYPE_OPTIONS = [
    { value: 'doc', label: 'Document' },
    { value: 'meeting', label: 'Meeting Recording' },
    { value: 'design', label: 'Design File' },
    { value: 'other', label: 'Other' },
];

interface DocumentFormProps {
    onSubmit: (payload: DocumentPayload) => Promise<void>;
    defaultValues?: ProjectDocument | null;
}

const DocumentForm = ({ onSubmit, defaultValues }: DocumentFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema),
        defaultValues: { type: 'doc' },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                title: defaultValues.title,
                url: defaultValues.url,
                type: defaultValues.type,
            });
        } else {
            reset({ title: '', url: '', type: 'doc' });
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Title"
                placeholder="Project Brief"
                error={errors.title?.message}
                {...register('title')}
            />
            <Input
                label="URL"
                placeholder="https://docs.google.com/..."
                error={errors.url?.message}
                {...register('url')}
            />
            <Select
                label="Type"
                options={TYPE_OPTIONS}
                error={errors.type?.message}
                {...register('type')}
            />
            <div className="flex justify-end pt-2">
                <Button type="submit">
                    {defaultValues ? 'Save changes' : 'Add document'}
                </Button>
            </div>
        </form>
    );
};

export default DocumentForm;