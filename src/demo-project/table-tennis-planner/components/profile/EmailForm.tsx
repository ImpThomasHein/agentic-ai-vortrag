'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { isValidEmail } from '@/components/players/playerUtils';

interface EmailFormProps {
  initialEmail: string;
  onSave: (email: string | null) => Promise<{ ok: boolean; error?: string }>;
}

export function EmailForm({ initialEmail, onSave }: EmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [savedEmail, setSavedEmail] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const hasChanges = email.trim() !== savedEmail;

  const handleSave = async () => {
    const trimmed = email.trim();

    if (trimmed && !isValidEmail(trimmed)) {
      setFeedback({ type: 'error', message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await onSave(trimmed || null);

    if (result.ok) {
      setSavedEmail(trimmed);
      setFeedback({ type: 'success', message: 'E-Mail-Adresse gespeichert.' });
    } else {
      setFeedback({ type: 'error', message: result.error ?? 'Fehler beim Speichern.' });
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="email"
        className="block text-xs font-semibold mb-1.5"
        style={{ color: 'var(--text-secondary)' }}
      >
        E-Mail-Adresse
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setFeedback(null);
        }}
        placeholder="deine@email.de"
        className="w-full px-4 py-3 rounded-xl text-sm bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-white/60 backdrop-blur-sm disabled:opacity-60 placeholder:text-gray-400 transition-all"
        style={{ color: 'var(--text-primary)' }}
        disabled={isSaving}
      />
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Wird für die Passwort-Zurücksetzung benötigt.
      </p>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-500/10 text-green-700 border border-green-300/30'
              : 'bg-red-500/10 text-red-700 border border-red-300/30'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <Button
        variant="glass-accent"
        onClick={handleSave}
        disabled={isSaving || !hasChanges}
        className="w-full"
      >
        {isSaving ? 'Speichern...' : 'E-Mail speichern'}
      </Button>
    </div>
  );
}
