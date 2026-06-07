'use client';

import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { ChatConversationHeader } from '@/features/chat/components/messages/ChatConversationHeader';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { MessageComposer } from '@/features/chat/components/messages/MessageComposer';

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  const { data: conversation } = useConversation(conversationId);
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useMessages(conversationId);

  const messages = messagesData?.data ?? [];
  const title = conversation?.title?.trim() || 'Conversa';

  return (
    <div className="flex h-full flex-col gap-3">
      <ChatConversationHeader title={title} />

      {isMessagesError && <Alert severity="error">Erro ao carregar mensagens.</Alert>}
      {isMessagesLoading && <LinearProgress />}

      <MessagesList messages={messages} isLoading={isMessagesLoading} />
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
