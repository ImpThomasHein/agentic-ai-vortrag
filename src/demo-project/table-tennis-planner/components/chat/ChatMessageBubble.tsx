/** Renders a single chat message bubble with avatar, content, edit and delete actions */
'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface ChatMessageBubbleProps {
  displayName: string;
  content: string | null;
  imageId: string | null;
  createdAt: string;
  isOwn: boolean;
  isEdited: boolean;
  canDelete: boolean;
  canEdit: boolean;
  onDelete?: () => void;
  onEdit?: (newContent: string) => Promise<void>;
}

/** Formats a timestamp as "10:30" or "Gestern 18:45" */
function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  if (date.toDateString() === now.toDateString()) return time;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Gestern ${time}`;

  return `${date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ${time}`;
}

/** Returns the first letter of displayName as avatar initial */
function getInitial(displayName: string): string {
  return displayName.charAt(0).toUpperCase();
}

export function ChatMessageBubble({
  displayName,
  content,
  imageId,
  createdAt,
  isOwn,
  isEdited,
  canDelete,
  canEdit,
  onDelete,
  onEdit,
}: ChatMessageBubbleProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content ?? '');
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText.length]);

  async function handleEditSubmit() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === content || !onEdit) {
      setEditing(false);
      setEditText(content ?? '');
      return;
    }
    await onEdit(trimmed);
    setEditing(false);
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setEditText(content ?? '');
    }
  }

  return (
    <div className={`flex gap-2 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          isOwn ? 'bg-blue-500/30 text-blue-700' : 'bg-gray-300/40 text-gray-700'
        }`}
      >
        {getInitial(displayName)}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Name + Time + Edited label */}
        <div
          className={`flex items-center gap-2 mb-0.5 text-[11px] text-gray-400 ${
            isOwn ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="font-medium">{displayName}</span>
          <span>{formatTime(createdAt)}</span>
          {isEdited && <span className="italic">(bearbeitet)</span>}
        </div>

        {/* Content bubble */}
        <div
          className={`relative rounded-2xl px-3 py-2 text-sm break-words ${
            isOwn
              ? 'bg-blue-500/15 rounded-tr-sm'
              : 'bg-white/10 rounded-tl-sm'
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          {imageId && (
            // eslint-disable-next-line @next/next/no-img-element -- Dynamic blob from API, not suitable for next/image
            <img
              src={`/api/chat-images/${imageId}`}
              alt="Chat-Bild"
              className="rounded-lg max-w-[200px] mb-1"
              loading="lazy"
            />
          )}

          {editing ? (
            <div className="flex flex-col gap-1">
              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                rows={2}
                className="bg-white/10 rounded-lg px-2 py-1 text-sm text-gray-100 resize-none outline-none focus:ring-1 focus:ring-blue-400/50"
              />
              <div className="flex gap-1 text-[10px]">
                <button onClick={handleEditSubmit} className="text-blue-300 hover:text-blue-200">
                  Speichern
                </button>
                <span className="text-gray-500">|</span>
                <button
                  onClick={() => { setEditing(false); setEditText(content ?? ''); }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            content && <p className="whitespace-pre-wrap">{content}</p>
          )}

          {/* Action buttons (hover) */}
          {!editing && (
            <>
              {canEdit && onEdit && content && (
                <button
                  onClick={() => { setEditText(content); setEditing(true); }}
                  className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-blue-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Nachricht bearbeiten"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M7 1.5l1.5 1.5L3.5 8H2V6.5L7 1.5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={onDelete}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Nachricht löschen"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 2l6 6M8 2l-6 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
