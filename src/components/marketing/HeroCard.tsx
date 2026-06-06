import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface HeroCardProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function HeroCard({ eyebrow, title, description, actions }: HeroCardProps) {
  return (
    <Paper className="rounded-2xl px-6 py-8 md:px-10 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Typography variant="overline" color="text.secondary">
            {eyebrow}
          </Typography>
          <Typography variant="h3" component="h1">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </div>
        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>
    </Paper>
  );
}
