'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MannschaftContent } from './MannschaftContent';

export function MannschaftTab() {
  const { user } = useAuth();
  const isTrainer = user?.role === 'trainer';
  const [subTab, setSubTab] = useState<'all' | 'my'>('all');

  return (
    <div>
      {/* Sub-Tabs nur für Trainer */}
      {isTrainer && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSubTab('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              subTab === 'all'
                ? 'bg-blue-500/20 text-blue-600 font-medium'
                : 'hover:bg-white/10'
            }`}
            style={subTab !== 'all' ? { color: 'var(--text-secondary)' } : undefined}
          >
            Mannschaften
          </button>
          <button
            onClick={() => setSubTab('my')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              subTab === 'my'
                ? 'bg-blue-500/20 text-blue-600 font-medium'
                : 'hover:bg-white/10'
            }`}
            style={subTab !== 'my' ? { color: 'var(--text-secondary)' } : undefined}
          >
            Meine Mannschaften
          </button>
        </div>
      )}

      <MannschaftContent mode={isTrainer ? subTab : 'my'} />
    </div>
  );
}
