import { clsx } from 'clsx';

interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
    <div
        className={clsx(
            'animate-pulse bg-slate-800 rounded-lg',
            className
        )}
    />
);

export const SkeletonRow = () => (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-20" />
    </div>
);

export default Skeleton;