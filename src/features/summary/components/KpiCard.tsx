import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface KpiCardProps {
  label: string;
  value: string;
  hint?: ReactNode;
  tone?: 'neutral' | 'success' | 'error';
}

const TONE_COLOR: Record<NonNullable<KpiCardProps['tone']>, string> = {
  neutral: 'text.primary',
  success: 'success.main',
  error: 'error.main',
};

export function KpiCard({ label, value, hint, tone = 'neutral' }: KpiCardProps) {
  return (
    <Paper className="flex flex-col gap-1 rounded-2xl px-4 py-4">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h5"
        component="span"
        sx={{ color: TONE_COLOR[tone], fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Paper>
  );
}
