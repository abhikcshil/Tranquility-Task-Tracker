'use client';

import { useActionState, useEffect, useRef } from 'react';
import { quickAddWithStateAction, type QuickAddActionState } from '@/app/actions';
import { successImpact } from '@/lib/haptics';
import { SubmitButton } from '@/components/ui/submit-button';

const initialState: QuickAddActionState = {
  status: 'idle',
  message: null,
};

export function QuickAddForm() {
  const [state, formAction, isPending] = useActionState(quickAddWithStateAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      successImpact();
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          required
          name="quickAdd"
          placeholder='Try: "Call mom tomorrow" or "Take vitamins daily"'
          className="tap-target flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-sky-500/40 transition focus:border-sky-500/50 focus:bg-zinc-900 focus:ring"
        />
        <SubmitButton
          pendingLabel="Adding..."
          className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 transition hover:border-sky-400/60 hover:bg-sky-500/15 active:scale-[0.98]"
          pendingClassName="bg-sky-500/15"
        >
          Capture
        </SubmitButton>
      </div>
      <div className="min-h-9" aria-live="polite">
        {isPending ? (
          <div className="motion-soft-enter rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
            Adding this to your system...
          </div>
        ) : null}
        {!isPending && state.message ? (
          <p
            className={
              state.status === 'error'
                ? 'pt-2 text-xs text-red-300 motion-soft-enter'
                : 'pt-2 text-xs text-emerald-300 motion-soft-enter'
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
