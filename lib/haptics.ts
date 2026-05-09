'use client';

type VibratePattern = number | number[];

function vibrate(pattern: VibratePattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Haptics are opportunistic; unsupported browsers should stay quiet.
  }
}

export function lightImpact() {
  vibrate(10);
}

export function successImpact() {
  vibrate([10, 30, 10]);
}

export function warningImpact() {
  vibrate([20, 40, 20]);
}
