'use client';

import { useEffect, useRef, useState } from 'react';
import { successImpact } from '@/lib/haptics';

type ProgressRingProps = {
  label: string;
  value: number;
  subtitle: string;
  centerLabel?: string;
  size?: number;
  variant?: 'card' | 'compact';
};

export function ProgressRing({
  label,
  value,
  subtitle,
  centerLabel,
  size = 112,
  variant = 'card',
}: ProgressRingProps) {
  const strokeWidth = 9;
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const previousValue = useRef(clampedValue);
  const [completedPulse, setCompletedPulse] = useState(false);
  const containerClass =
    variant === 'card'
      ? 'flex flex-col items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700'
      : 'flex min-w-0 flex-1 flex-col items-center gap-1.5';
  const percentClass =
    variant === 'card'
      ? 'absolute inset-0 flex items-center justify-center text-lg font-semibold text-zinc-100'
      : 'absolute inset-0 flex items-center justify-center text-base font-semibold text-zinc-100';
  const labelClass =
    variant === 'card'
      ? 'text-sm font-medium text-zinc-100'
      : 'text-center text-xs font-medium leading-tight text-zinc-100';
  const subtitleClass =
    variant === 'card'
      ? 'text-xs text-zinc-400'
      : 'text-center text-[11px] leading-tight text-zinc-400';

  useEffect(() => {
    if (previousValue.current < 100 && clampedValue >= 100) {
      setCompletedPulse(true);
      successImpact();
      const timeout = window.setTimeout(() => setCompletedPulse(false), 760);
      previousValue.current = clampedValue;
      return () => window.clearTimeout(timeout);
    }

    previousValue.current = clampedValue;
    return undefined;
  }, [clampedValue]);

  return (
    <div className={`${containerClass} ${completedPulse ? 'motion-complete-glow' : ''}`}>
      <div
        className={`relative ${completedPulse ? 'motion-ring-bump' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-sky-400"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 560ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div className={percentClass}>{centerLabel ?? `${Math.round(clampedValue)}%`}</div>
      </div>
      <p className={labelClass}>{label}</p>
      <p className={subtitleClass}>{subtitle}</p>
    </div>
  );
}
