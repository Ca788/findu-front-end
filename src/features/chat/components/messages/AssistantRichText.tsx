'use client';

import { Fragment, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface AssistantRichTextProps {
  text: string;
  streaming?: boolean;
}

function cleanDashes(value: string): string {
  return value.replace(/\u2014|\u2013/g, ':');
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <Box component="strong" key={`b-${index}`} sx={{ fontWeight: 650 }}>
          {bold[1]}
        </Box>
      );
    }
    return <Fragment key={`t-${index}`}>{part}</Fragment>;
  });
}

function headingLevel(line: string): 2 | 3 | null {
  if (line.startsWith('### ')) return 3;
  if (line.startsWith('## ')) return 2;
  return null;
}

function listItem(line: string): string | null {
  const match = line.match(/^[-*]\s+(.+)$/) ?? line.match(/^\d+\.\s+(.+)$/);
  return match ? match[1] : null;
}

export function AssistantRichText({ text, streaming = false }: AssistantRichTextProps) {
  const cleaned = cleanDashes(text);
  const lines = cleaned.split('\n');
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = listBuffer;
    listBuffer = [];
    blocks.push(
      <Box
        key={`ul-${blocks.length}`}
        component="ul"
        sx={{
          m: 0,
          pl: 2.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.45,
        }}
      >
        {items.map((item, index) => (
          <Typography
            key={index}
            component="li"
            variant="body2"
            sx={{ fontSize: 15, lineHeight: 1.55, pl: 0.25 }}
          >
            {renderInline(item)}
          </Typography>
        ))}
      </Box>,
    );
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const item = listItem(trimmed);
    if (item) {
      listBuffer.push(item);
      return;
    }
    flushList();
    if (!trimmed) return;

    const heading = headingLevel(trimmed);
    if (heading) {
      const content = trimmed.replace(/^#{2,3}\s+/, '');
      blocks.push(
        <Typography
          key={`h-${blocks.length}`}
          variant={heading === 2 ? 'subtitle1' : 'subtitle2'}
          component={heading === 2 ? 'h3' : 'h4'}
          sx={{ fontWeight: 650, fontSize: heading === 2 ? 16 : 14.5, letterSpacing: '-0.02em' }}
        >
          {renderInline(content)}
        </Typography>,
      );
      return;
    }

    blocks.push(
      <Typography
        key={`p-${blocks.length}`}
        variant="body2"
        component="p"
        sx={{ m: 0, fontSize: 15, lineHeight: 1.6 }}
      >
        {renderInline(trimmed)}
      </Typography>,
    );
  });

  flushList();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {blocks}
      {streaming ? (
        <Box
          component="span"
          aria-hidden
          sx={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            animation: 'fu-stream-dot 1.1s ease-in-out infinite',
            '@keyframes fu-stream-dot': {
              '0%, 100%': { opacity: 0.35, transform: 'scale(0.85)' },
              '50%': { opacity: 1, transform: 'scale(1)' },
            },
          }}
        />
      ) : null}
    </Box>
  );
}
