'use client';

import { useState } from 'react';
import { lightImpact, successImpact, warningImpact } from '@/lib/haptics';
import { SubmitButton } from '@/components/ui/submit-button';

type ActionSubmitButtonProps = {
  children: string;
  pendingLabel?: string;
  className?: string;
  haptic?: 'light' | 'success' | 'warning';
  points?: number;
};

export function ActionSubmitButton({
  children,
  pendingLabel,
  className = '',
  haptic = 'light',
  points = 0,
}: ActionSubmitButtonProps) {
  const [showPoints, setShowPoints] = useState(false);

  function handlePress() {
    if (points > 0) {
      setShowPoints(false);
      window.requestAnimationFrame(() => setShowPoints(true));
    }

    if (haptic === 'success') {
      successImpact();
      return;
    }

    if (haptic === 'warning') {
      warningImpact();
      return;
    }

    lightImpact();
  }

  return (
    <span className="relative inline-flex">
      <SubmitButton pendingLabel={pendingLabel} className={className} onPress={handlePress}>
        {children}
      </SubmitButton>
      {showPoints ? (
        <span
          className="pointer-events-none absolute -right-1 -top-3 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200 opacity-0 motion-points-pop"
          onAnimationEnd={() => setShowPoints(false)}
        >
          +{points}
        </span>
      ) : null}
    </span>
  );
}
