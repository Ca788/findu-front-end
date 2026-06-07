'use client';

import Typography from '@mui/material/Typography';
import { absoluteApiUrl } from '@/utils/url';

interface AudioMessagePlayerProps {
  url: string;
  tone?: 'user' | 'assistant';
}

export function AudioMessagePlayer({ url, tone = 'assistant' }: AudioMessagePlayerProps) {
  const href = absoluteApiUrl(url);

  if (!href) {
    return (
      <Typography variant="caption" color="text.secondary">
        Áudio indisponível
      </Typography>
    );
  }

  return (
    <audio
      controls
      preload="metadata"
      src={href}
      className={`w-full ${tone === 'user' ? 'filter-invert' : ''}`}
      style={{ height: 36, minWidth: 220 }}
    />
  );
}
