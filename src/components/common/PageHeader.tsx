import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h5"
          component="h2"
          className="font-semibold"
          sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' }, lineHeight: 1.25 }}
        >
          {title}
        </Typography>
      </div>
      {actions && (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end [&_.MuiButton-root]:w-full sm:[&_.MuiButton-root]:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
