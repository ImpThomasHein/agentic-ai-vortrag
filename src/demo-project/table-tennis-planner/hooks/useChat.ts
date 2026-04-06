/** Hook for team chat: polling, sending, deleting messages, and image upload */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import { mergeMessages } from './useChatHelpers';

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content?: string, imageId?: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  loadMore: () => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  hasMore: boolean;
  isLoading: boolean;
  isSending: boolean;
  isUploading: boolean;
}

const POLL_INTERVAL = 5000;
const PAGE_SIZE = 50;

export function useChat(teamId: string | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCreatedAtRef = useRef<string | undefined>(undefined);

  /** Fetches messages, optionally only newer than the latest known message */
  const fetchMessages = useCallback(
    async (sinceCreatedAt?: string) => {
      if (!teamId) return;
      const url = sinceCreatedAt
        ? `/api/teams/${teamId}/chat?after=${encodeURIComponent(sinceCreatedAt)}&limit=${PAGE_SIZE}`
        : `/api/teams/${teamId}/chat?limit=${PAGE_SIZE}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const incoming: ChatMessage[] = await res.json();

      setMessages((prev) => {
        if (sinceCreatedAt) {
          const newMessages = incoming.filter(
            (m) => new Date(m.createdAt) > new Date(sinceCreatedAt)
          );
          if (newMessages.length > 0) {
            const merged = mergeMessages(prev, newMessages);
            lastCreatedAtRef.current = merged[merged.length - 1].createdAt;
            return merged;
          }
          return prev;
        }
        if (incoming.length > 0) {
          lastCreatedAtRef.current = incoming[incoming.length - 1].createdAt;
        }
        return incoming;
      });
    },
    [teamId]
  );

  // Initial load
  useEffect(() => {
    if (!teamId) {
      setMessages([]);
      lastCreatedAtRef.current = undefined;
      return;
    }
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));
  }, [teamId, fetchMessages]);

  // Polling for new messages — uses ref to avoid re-creating interval on every state change
  useEffect(() => {
    if (!teamId) return;

    intervalRef.current = setInterval(() => {
      fetchMessages(lastCreatedAtRef.current);
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [teamId, fetchMessages]);

  const sendMessage = useCallback(
    async (content?: string, imageId?: string) => {
      if (!teamId) return;
      setIsSending(true);
      try {
        const res = await fetch(`/api/teams/${teamId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, imageId }),
        });
        if (!res.ok) return;
        const newMessage: ChatMessage = await res.json();
        setMessages((prev) => mergeMessages(prev, [newMessage]));
      } finally {
        setIsSending(false);
      }
    },
    [teamId]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!teamId) return;
      const res = await fetch(`/api/teams/${teamId}/chat/${messageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    },
    [teamId]
  );

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!teamId) return;
      const res = await fetch(`/api/teams/${teamId}/chat/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) return;
      const updated: ChatMessage = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
    },
    [teamId]
  );

  const loadMore = useCallback(async () => {
    if (!teamId || !hasMore || messages.length === 0) return;
    const oldestCreatedAt = messages[0].createdAt;
    const res = await fetch(
      `/api/teams/${teamId}/chat?before=${encodeURIComponent(oldestCreatedAt)}&limit=${PAGE_SIZE}`
    );
    if (!res.ok) return;
    const older: ChatMessage[] = await res.json();
    if (older.length < PAGE_SIZE) setHasMore(false);
    setMessages((prev) => mergeMessages(older, prev));
  }, [teamId, hasMore, messages]);

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/chat-images', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Upload fehlgeschlagen');
        const data = await res.json();
        return data.id as string;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return {
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
  };
}
