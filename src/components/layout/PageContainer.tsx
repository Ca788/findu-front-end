import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageContainer({
  children,
  className = '',
  contentClassName = 'w-full',
}: PageContainerProps) {
  return (
    <div
      className={`flex flex-1 items-center justify-center px-4 ${className}`}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
