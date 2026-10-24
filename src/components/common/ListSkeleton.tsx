import type { CSSProperties } from 'react';
import Skeleton from '@mui/material/Skeleton';

interface ListSkeletonProps {
  rows?: number;
  height?: number;
  columns?: 1 | 2;
}

export function ListSkeleton({ rows = 4, height = 96, columns = 1 }: ListSkeletonProps) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`} aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={height}
          sx={{ borderRadius: '14px' }}
          className="findu-anim-rise"
          style={{ '--findu-delay': `${index * 60}ms` } as CSSProperties}
        />
      ))}
    </div>
  );
}
