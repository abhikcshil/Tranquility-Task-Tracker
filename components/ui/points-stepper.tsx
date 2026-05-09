'use client';

import { useState } from 'react';

type PointsStepperProps = {
  name: string;
  defaultValue?: number | null;
  compact?: boolean;
};

function normalizePoints(value: number | null | undefined): number {
  if (!Number.isFinite(value ?? NaN)) {
    return 5;
  }

  return Math.max(0, Math.round((value ?? 5) / 5) * 5);
}

export function PointsStepper({ name, defaultValue = 5, compact = false }: PointsStepperProps) {
  const [points, setPoints] = useState(normalizePoints(defaultValue));
  const pointOptions = Array.from(
    { length: Math.max(40, Math.ceil(points / 5)) + 1 },
    (_, index) => index * 5,
  );

  function adjust(delta: number) {
    setPoints((current) => Math.max(0, current + delta));
  }

  const buttonClass =
    'pressable tap-target rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500';
  const selectClass = compact
    ? 'min-w-0 flex-1 rounded-l-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-xs text-zinc-100 outline-none ring-sky-500/40 focus:ring'
    : 'min-w-0 flex-1 rounded-l-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-sky-500/40 focus:ring';

  return (
    <div className="flex items-stretch gap-2">
      <button type="button" className={buttonClass} onClick={() => adjust(-5)}>
        -5
      </button>
      <button type="button" className={buttonClass} onClick={() => adjust(5)}>
        +5
      </button>
      <div className="flex min-w-0 flex-1">
        <select
          name={name}
          value={points}
          onChange={(event) => setPoints(Number(event.target.value))}
          className={selectClass}
        >
          {pointOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <span className="inline-flex items-center rounded-r-lg border border-l-0 border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300">
          pts
        </span>
      </div>
    </div>
  );
}
