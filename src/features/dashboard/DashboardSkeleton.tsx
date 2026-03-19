import Skeleton from '../../components/ui/Skeleton';

const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
        </div>
        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
        </div>
    </div>
);

export default DashboardSkeleton;