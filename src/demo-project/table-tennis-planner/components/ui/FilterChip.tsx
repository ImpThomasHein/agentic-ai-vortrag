'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  selected?: boolean;
  colorScheme?: {
    bg: string;
    text: string;
  };
}

const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className = '', selected = false, colorScheme, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 min-h-[40px] border backdrop-blur-md';

    const getStyles = () => {
      if (selected && colorScheme) {
        return `${colorScheme.bg} ${colorScheme.text} border-current shadow-lg scale-105`;
      }
      if (selected) {
        return 'bg-blue-500/20 text-blue-700 border-blue-400/50 shadow-lg shadow-blue-500/20 scale-105';
      }
      return 'bg-white/40 text-gray-600 border-white/30 hover:bg-white/60 hover:scale-105';
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`${baseStyles} ${getStyles()} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';

export default FilterChip;
