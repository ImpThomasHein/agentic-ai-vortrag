'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'glass-dark';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', padding = 'md', variant = 'glass', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const variants = {
      default: 'bg-white rounded-xl shadow-sm border border-gray-200',
      glass: 'glass rounded-2xl',
      'glass-dark': 'glass-dark rounded-2xl',
    };

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
