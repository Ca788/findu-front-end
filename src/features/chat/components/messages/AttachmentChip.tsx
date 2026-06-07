'use client';

import Image from 'next/image';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import type { MessageAttachment } from '@/features/chat/models/message.model';

function absoluteUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  try {
    const apiBase = new URL(base, 'http://localhost');
    return new URL(url, `${apiBase.protocol}//${apiBase.host}`).toString();
  } catch {
    return url;
  }
}

interface AttachmentChipProps {
  attachment: MessageAttachment;
}

export function AttachmentChip({ attachment }: AttachmentChipProps) {
  const href = absoluteUrl(attachment.url);
  const isImage = attachment.content_type.startsWith('image/');

  if (isImage) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" underline="none">
        <Image
          src={href}
          alt={attachment.filename}
          width={160}
          height={160}
          unoptimized
          className="rounded-lg object-cover"
          style={{ width: 160, height: 'auto' }}
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-divider px-2 py-1"
    >
      <InsertDriveFileIcon fontSize="small" />
      <Typography variant="caption" className="truncate">
        {attachment.filename}
      </Typography>
    </Link>
  );
}
