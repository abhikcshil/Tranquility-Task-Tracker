'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  pendingClassName?: string;
  onPress?: () => void;
};

export function SubmitButton({
  children,
  pendingLabel = 'Working...',
  className = '',
  pendingClassName = '',
  onPress,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={onPress}
      className={[
        'tap-target touch-manipulation disabled:cursor-wait disabled:opacity-70',
        className,
        pending ? pendingClassName : '',
      ].join(' ')}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending ? <span className="motion-spinner" aria-hidden="true" /> : null}
        {pending ? pendingLabel : children}
      </span>
    </button>
  );
}
