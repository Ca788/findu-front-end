'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ChatConversationPage } from '@/features/chat/components/messages/ChatConversationPage';

function ChatConversationRoute() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  if (!id) {
    return (
      <Box className="flex flex-1 items-center justify-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  return <ChatConversationPage conversationId={id} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box className="flex flex-1 items-center justify-center py-12">
          <CircularProgress />
        </Box>
      }
    >
      <ChatConversationRoute />
    </Suspense>
  );
}
