'use client';

import { useState } from 'react';

interface VoteButtonProps {
  voted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function VoteButton({ voted, onToggle, disabled = false }: VoteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    onToggle();

    // Animation zurücksetzen
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        transition-all duration-300 min-h-[40px]
        backdrop-blur-md border
        ${
          voted
            ? 'bg-pink-500/20 text-pink-600 border-pink-300/40 hover:bg-pink-500/30 hover:scale-105 shadow-lg shadow-pink-500/20'
            : 'bg-white/40 text-gray-600 border-white/30 hover:bg-white/60 hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isAnimating ? 'scale-110' : ''}
      `}
      aria-label={voted ? 'Vote entfernen' : 'Für diese Übung voten'}
    >
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          isAnimating ? 'scale-125 rotate-12' : 'scale-100'
        }`}
        viewBox="0 0 20 20"
        fill={voted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={voted ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        />
      </svg>
      <span>{voted ? 'Gewählt' : 'Wählen'}</span>
    </button>
  );
}
