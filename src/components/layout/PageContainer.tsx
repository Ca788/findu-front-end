import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div
      className={`flex flex-1 items-center justify-center px-4 ${className}`}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}
