'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Exercise, BallTrajectory, ExerciseCategory, DifficultyLevel } from '@/lib/types';
import { DiagramEditor } from '@/components/editor';
import { UserProfileWidget } from '@/components/auth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button, Card } from '@/components/ui';
import { CATEGORY_LABELS, DIFFICULTY_LABELS, CATEGORIES, DIFFICULTIES } from '@/lib/constants';

export default function ExerciseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading: authLoading, isAuthorized } = useRequireAuth({ allowedRoles: ['trainer'] });
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Einzelne Übung per ID laden
  useEffect(() => {
    async function loadExercise() {
      try {
        const res = await fetch(`/api/exercises/${id}`);
        if (res.status === 404) {
          setError('Übung nicht gefunden');
          return;
        }
        if (!res.ok) throw new Error('Failed to load exercise');
        const data: Exercise = await res.json();
        setExercise(data);
      } catch (err) {
        setError('Fehler beim Laden der Übung');
        console.error(err);
      }
    }
    loadExercise();
  }, [id]);

  // Trajektorien ändern
  const handleTrajectoriesChange = (trajectories: BallTrajectory[]) => {
    if (!exercise) return;
    setExercise({
      ...exercise,
      diagram: { ...exercise.diagram, trajectories },
    });
    setHasChanges(true);
  };

  // Übungs-Feld ändern
  const updateField = <K extends keyof Exercise>(field: K, value: Exercise[K]) => {
    if (!exercise) return;
    setExercise({ ...exercise, [field]: value });
    setHasChanges(true);
  };

  // TTR-Bereich ändern
  const updateTtrRange = (field: 'min' | 'max', value: number) => {
    if (!exercise) return;
    setExercise({
      ...exercise,
      ttrRange: { ...exercise.ttrRange, [field]: value },
    });
    setHasChanges(true);
  };

  // Speichern
  const handleSave = async () => {
    if (!exercise) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: exercise.name,
          description: exercise.description,
          hints: exercise.hints,
          category: exercise.category,
          difficulty: exercise.difficulty,
          ttrMin: exercise.ttrRange.min,
          ttrMax: exercise.ttrRange.max,
          durationMinutes: exercise.duration ?? null,
          diagram: exercise.diagram,
          tags: exercise.tags,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setHasChanges(false);
    } catch (err) {
      setError('Fehler beim Speichern');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="glass" className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/trainer">
            <Button variant="primary">Zurück</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="floating-orb w-96 h-96 bg-purple-400 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-80 h-80 bg-pink-400 bottom-[10%] right-[-8%]" style={{ animationDelay: '5s' }} />

      {/* Header */}
      <header className="glass-dark border-b border-white/20 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/trainer"
                className="p-2 -ml-2 hover:bg-white/30 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Übung bearbeiten
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {exercise.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 font-medium">
                  Ungespeicherte Änderungen
                </span>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? 'Speichert...' : 'Speichern'}
              </Button>
              <UserProfileWidget />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Übungs-Info bearbeitbar */}
        <Card variant="glass" className="p-4 mb-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Name
              </label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Beschreibung
              </label>
              <textarea
                value={exercise.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            {/* Kategorie & Schwierigkeit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Kategorie
                </label>
                <select
                  value={exercise.category}
                  onChange={(e) => updateField('category', e.target.value as ExerciseCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ color: '#000' }}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Schwierigkeit
                </label>
                <select
                  value={exercise.difficulty}
                  onChange={(e) => updateField('difficulty', e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff} style={{ color: '#000' }}>
                      {DIFFICULTY_LABELS[diff]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TTR & Dauer */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  TTR Min
                </label>
                <input
                  type="number"
                  value={exercise.ttrRange.min}
                  onChange={(e) => updateTtrRange('min', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  TTR Max
                </label>
                <input
                  type="number"
                  value={exercise.ttrRange.max}
                  onChange={(e) => updateTtrRange('max', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Dauer (Min)
                </label>
                <input
                  type="number"
                  value={exercise.duration || ''}
                  onChange={(e) => updateField('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Tipps */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Tipps (einer pro Zeile)
              </label>
              <textarea
                value={(exercise.hints || []).join('\n')}
                onChange={(e) => updateField('hints', e.target.value.split('\n').filter(h => h.trim()))}
                rows={2}
                placeholder="Tipp 1&#10;Tipp 2"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </Card>

        {/* Editor */}
        <DiagramEditor
          trajectories={exercise.diagram?.trajectories || []}
          onChange={handleTrajectoriesChange}
        />
      </main>
    </div>
  );
}
