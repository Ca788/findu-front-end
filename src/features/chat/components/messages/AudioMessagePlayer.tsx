'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { absoluteApiUrl } from '@/utils/url';

interface AudioMessagePlayerProps {
  url: string;
  tone?: 'user' | 'assistant';
  transcript?: string | null;
}

export function AudioMessagePlayer({
  url,
  tone = 'assistant',
  transcript,
}: AudioMessagePlayerProps) {
  const [src, setSrc] = useState<string | null>(url.startsWith('blob:') ? url : null);
  const [failed, setFailed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const hasTranscript = !!transcript && transcript.trim().length > 0;
  const onDark = tone === 'user';

  useEffect(() => {
    if (!url) {
      setSrc(null);
      return;
    }
    if (url.startsWith('blob:')) {
      setSrc(url);
      setFailed(false);
      return;
    }

    const href = absoluteApiUrl(url);
    if (!href) {
      setFailed(true);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    const token = appStorage.get<string>(AppStorageKeys.TOKEN);
    const headers: HeadersInit = { Accept: 'audio/*,*/*' };
    if (token) {
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    fetch(href, { headers })
      .then(async (response) => {
        if (cancelled) return;
        const type = response.headers.get('content-type') || '';
        if (!response.ok || type.includes('json') || type.includes('html')) {
          setSrc(href);
          return;
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        setFailed(false);
      })
      .catch(() => {
        if (!cancelled) setSrc(href);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (!src && !failed) {
    return (
      <Typography variant="caption" color={onDark ? 'inherit' : 'text.secondary'} sx={{ opacity: 0.8 }}>
        Carregando áudio…
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0.75, minWidth: 220 }}>
      {src && !failed ? (
        <audio
          controls
          playsInline
          preload="metadata"
          src={src}
          onError={() => setFailed(true)}
          style={{ height: 36, width: '100%' }}
        />
      ) : (
        <Typography variant="caption" color={onDark ? 'inherit' : 'text.secondary'} sx={{ opacity: 0.85 }}>
          Áudio indisponível neste aparelho. {hasTranscript ? 'Abra a transcrição.' : ''}
        </Typography>
      )}
      {hasTranscript ? (
        <>
          <Button
            type="button"
            size="small"
            onClick={() => setShowTranscript((open) => !open)}
            sx={{
              alignSelf: 'flex-start',
              minWidth: 0,
              px: 0,
              py: 0,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12.5,
              color: onDark ? 'inherit' : 'text.secondary',
              opacity: 0.9,
            }}
          >
            {showTranscript ? 'Ver menos' : 'Ver transcrição'}
          </Button>
          {showTranscript ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
                lineHeight: 1.55,
                opacity: 0.92,
              }}
            >
              {transcript}
            </Typography>
          ) : null}
        </>
      ) : null}
    </Box>
  );
}
