import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface AuthCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Paper className="rounded-2xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          {eyebrow ? (
            <Typography variant="overline" color="text.secondary">
              {eyebrow}
            </Typography>
          ) : null}
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : null}
        </div>
        {children}
      </div>
    </Paper>
  );
}
