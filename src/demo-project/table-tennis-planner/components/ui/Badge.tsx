'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/40 text-gray-700 border border-white/30',
      success: 'bg-green-100/60 text-green-700 border border-green-200/40',
      warning: 'bg-yellow-100/60 text-yellow-700 border border-yellow-200/40',
      error: 'bg-red-100/60 text-red-700 border border-red-200/40',
      info: 'bg-blue-100/60 text-blue-700 border border-blue-200/40',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center font-semibold rounded-full backdrop-blur-sm ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
