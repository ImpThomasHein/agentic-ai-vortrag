'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface DropdownMenuItem {
  type?: 'item' | 'separator';
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  header?: ReactNode;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'right',
  header,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position berechnen wenn Menü geöffnet wird
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 200; // min-w-[200px]

      let left = align === 'right'
        ? rect.right - menuWidth
        : rect.left;

      // Sicherstellen, dass das Menü nicht aus dem Viewport ragt
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }

      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: left + window.scrollX,
      });
    }
  }, [isOpen, align]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Scroll handler - Menü schließen beim Scrollen
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled || item.type === 'separator' || !item.onClick) return;
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={triggerRef}>
      {/* Trigger Button */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown Menu - als Portal gerendert */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          className="z-[9999] min-w-[200px] py-1 glass-dark rounded-xl border border-white/20 shadow-xl shadow-black/10 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Optional Header */}
          {header && (
            <div className="px-3 py-2 border-b border-white/10">
              {header}
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            {items.map((item, index) => {
              // Separator
              if (item.type === 'separator') {
                return (
                  <div
                    key={index}
                    className="my-1 border-t border-white/10"
                  />
                );
              }

              // Regular item
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`
                    w-full px-3 py-2 text-left text-sm
                    flex items-center gap-2
                    transition-colors duration-150
                    ${item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10 cursor-pointer'
                    }
                    ${item.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-500/10'
                      : ''
                    }
                  `}
                  style={item.variant !== 'danger' ? { color: 'var(--text-primary)' } : undefined}
                >
                  {item.icon && (
                    <span className="w-4 h-4 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// 3-Punkte Trigger Button
export function MenuTriggerButton({ className = '' }: { className?: string }) {
  return (
    <button
      className={`
        p-2 rounded-lg
        hover:bg-white/20 active:bg-white/30
        transition-colors duration-150
        ${className}
      `}
      aria-label="Menü öffnen"
    >
      <svg
        className="w-5 h-5"
        style={{ color: 'var(--text-secondary)' }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  );
}
