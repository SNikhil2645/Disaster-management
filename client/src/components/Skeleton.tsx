interface SkeletonProps {
  className?: string;
  as?: 'div' | 'span';
}

const Skeleton = ({ className = '', as: Tag = 'div' }: SkeletonProps) => (
  <Tag className={`bg-surface-border rounded animate-pulse ${className}`}>&zwnj;</Tag>
);

export const SkeletonCard = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="w-10 h-10 rounded-btn" />
    </div>
  </div>
);

export const SkeletonListItem = () => (
  <div className="card-hover p-6 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card-hover p-5 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-btn" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-3 border-t border-surface-border">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonStatRow = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Skeleton;
