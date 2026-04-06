/** Collapsible team chat container with message list, input, and auto-scroll */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { shouldShowDateSeparator } from '@/hooks/useChatHelpers';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatInput } from './ChatInput';
import { DateSeparator } from './DateSeparator';

interface TeamChatProps {
  teamId: string;
  currentUserId: string;
  isTrainer: boolean;
  defaultExpanded?: boolean;
}

export function TeamChat({ teamId, currentUserId, isTrainer, defaultExpanded = false }: TeamChatProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    sendMessage,
    deleteMessage,
    editMessage,
    loadMore,
    uploadImage,
    hasMore,
    isLoading,
    isSending,
    isUploading,
  } = useChat(expanded ? teamId : null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (expanded && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expanded, messages.length]);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-300">
            <path d="M15 12.6a1.5 1.5 0 0 1-1.5 1.5H5.1L2.4 16.8V4.2A1.5 1.5 0 0 1 3.9 2.7h9.6a1.5 1.5 0 0 1 1.5 1.5v8.4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold text-gray-100">Chat</span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Messages area */}
        <div className="h-80 overflow-y-auto px-3 py-2 space-y-3">
          {/* Load more button */}
          {hasMore && messages.length > 0 && (
            <button
              onClick={loadMore}
              className="w-full text-xs text-gray-400 hover:text-gray-200 py-1"
            >
              Ältere Nachrichten laden
            </button>
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <p className="text-center text-xs text-gray-500 py-8">
              Noch keine Nachrichten. Schreib die erste!
            </p>
          )}

          {messages.map((msg, i) => {
            const prevCreatedAt = i > 0 ? messages[i - 1].createdAt : null;
            const showSeparator = shouldShowDateSeparator(prevCreatedAt, msg.createdAt);
            const isOwn = msg.userId === currentUserId;
            const canDelete = isOwn || isTrainer;
            const canEdit = isOwn;

            return (
              <div key={msg.id}>
                {showSeparator && <DateSeparator date={msg.createdAt} />}
                <ChatMessageBubble
                  displayName={msg.displayName}
                  content={msg.content}
                  imageId={msg.imageId}
                  createdAt={msg.createdAt}
                  isOwn={isOwn}
                  isEdited={msg.isEdited}
                  canDelete={canDelete}
                  canEdit={canEdit}
                  onDelete={() => deleteMessage(msg.id)}
                  onEdit={(newContent) => editMessage(msg.id, newContent)}
                />
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onUploadImage={uploadImage}
          isSending={isSending}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
}
