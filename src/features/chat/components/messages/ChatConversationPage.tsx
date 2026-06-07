'use client';

import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { ChatConversationHeader } from '@/features/chat/components/messages/ChatConversationHeader';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { MessageComposer } from '@/features/chat/components/messages/MessageComposer';

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  const { data: conversation } = useConversation(conversationId);
  const { messages, status } = useConversationMessages(conversationId);

  const title = conversation?.title?.trim() || 'Conversa';
  const isLoading = status === 'loading';

  return (
    <div className="flex h-full flex-col gap-3">
      <ChatConversationHeader title={title} />

      {status === 'error' && <Alert severity="error">Erro ao carregar mensagens.</Alert>}
      {isLoading && <LinearProgress />}

      <MessagesList messages={messages} isLoading={isLoading} />
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
