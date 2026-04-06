/**
 * Reusable dashboard info card for the homepage.
 * Displays a clickable glass-morphism card with accent color, title, subtitle, and optional stats badges.
 */
'use client';

import Link from 'next/link';

interface DashboardKarteStat {
  label: string;
  variant: 'blue' | 'green' | 'red' | 'neutral';
}

interface DashboardKarteProps {
  title: string;
  subtitle: string;
  detail?: string;
  href: string;
  accent?: boolean;
  accentColor?: 'blue' | 'green';
  stats?: DashboardKarteStat[];
}

const statStyles: Record<DashboardKarteStat['variant'], string> = {
  blue: 'bg-blue-500/8 text-blue-700 border border-blue-200/30',
  green: 'bg-green-500/8 text-green-700 border border-green-500/20',
  red: 'bg-red-500/8 text-red-600 border border-red-500/15',
  neutral: 'bg-black/4 text-black/55',
};

const accentBorderColor: Record<string, string> = {
  blue: 'border-l-[#2563eb]',
  green: 'border-l-[#16a34a]',
};

const accentLabelColor: Record<string, string> = {
  blue: 'text-[#2563eb]',
  green: 'text-[#16a34a]',
};

export function DashboardKarte({
  title,
  subtitle,
  detail,
  href,
  accent = false,
  accentColor = 'blue',
  stats,
}: DashboardKarteProps) {
  return (
    <Link
      href={href}
      className={`block glass rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:shadow-lg ${
        accent ? `border-l-[3px] ${accentBorderColor[accentColor]}` : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          {accent && (
            <div className={`text-[11px] uppercase tracking-wider font-semibold mb-1.5 ${accentLabelColor[accentColor]}`}>
              {title}
            </div>
          )}
          {!accent && (
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {title}
            </div>
          )}
          <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {subtitle}
          </div>
          {detail && (
            <div className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {detail}
            </div>
          )}
        </div>
        <div className="text-xl" style={{ color: accent ? undefined : 'var(--text-secondary)' }}>
          <span className={accent ? accentLabelColor[accentColor] : ''}>→</span>
        </div>
      </div>
      {stats && stats.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {stats.map((stat, i) => (
            <span key={i} className={`text-[13px] px-2.5 py-1 rounded-md ${statStyles[stat.variant]}`}>
              {stat.label}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
