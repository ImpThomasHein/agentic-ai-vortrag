/** Chat input with text field, send button, and image upload for smartphone use */
'use client';

import { useState, useRef, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (content?: string, imageId?: string) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  isSending: boolean;
  isUploading: boolean;
}

export function ChatInput({ onSend, onUploadImage, isSending, isUploading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [pendingImageId, setPendingImageId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = (text.trim().length > 0 || pendingImageId) && !isSending && !isUploading;

  async function handleSend() {
    if (!canSend) return;
    const content = text.trim() || undefined;
    const imageId = pendingImageId ?? undefined;
    try {
      await onSend(content, imageId);
      setText('');
      setPendingImageId(null);
    } catch {
      // Keep input on failure so user doesn't lose their message
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleFileSelect(file: File) {
    setUploadError(null);
    try {
      const imageId = await onUploadImage(file);
      setPendingImageId(imageId);
    } catch {
      setUploadError('Upload fehlgeschlagen. Erneut versuchen.');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  }

  return (
    <div className="border-t border-white/10 p-2">
      {/* Image preview */}
      {(pendingImageId || isUploading) && (
        <div className="flex items-center gap-2 mb-2 px-1">
          {isUploading ? (
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                  <path d="M3 8l4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <button
                onClick={() => setPendingImageId(null)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Entfernen
              </button>
            </>
          )}
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="text-xs text-red-400 mb-1 px-1 flex items-center gap-1">
          <span>{uploadError}</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="underline hover:text-red-300"
          >
            Wiederholen
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200 shrink-0"
          aria-label="Bild anhängen"
          disabled={isUploading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.5 10.8l-6.2 6.2a4.5 4.5 0 0 1-6.4-6.4l6.2-6.2a3 3 0 0 1 4.2 4.2l-6.2 6.2a1.5 1.5 0 0 1-2.1-2.1l5.7-5.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht schreiben..."
          rows={1}
          className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm placeholder-gray-500 resize-none outline-none focus:ring-1 focus:ring-blue-400/50 max-h-24"
          style={{ color: 'var(--text-primary)' }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="p-2 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          aria-label="Senden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.5 17.5l15-7.5-15-7.5v5.8l10.7 1.7-10.7 1.7v5.8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
