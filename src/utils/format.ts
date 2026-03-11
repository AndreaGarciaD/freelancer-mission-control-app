import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from 'date-fns';

export const formatDate = (date: string): string =>
    format(new Date(date), 'MMMM d, yyyy');

export const formatRelative = (date: string): string =>
    formatDistanceToNow(new Date(date), { addSuffix: true });

export const isOverdue = (date: string): boolean =>
    isPast(new Date(date));

export const isDueSoon = (deadline: string, withinDays = 7): boolean =>
    isWithinInterval(new Date(deadline), {
        start: new Date(),
        end: addDays(new Date(), withinDays)
    });

export const formatDeadLineStatus = (deadline: string): {
    label: string;
    variant: 'danger' | 'warning' | 'normal';
} => {
    if (isOverdue(deadline)) return { label: 'Overdue', variant: 'danger' };
    if (isDueSoon(deadline)) return { label: 'Due soon', variant: 'warning' };
    return { label: formatDate(deadline), variant: 'normal' };
};

export const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(value);
};