import type { HabitInput } from '@/services/habitCrudService';

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePoints(value: FormDataEntryValue | null): number {
  const parsed = parseOptionalInt(value) ?? 5;
  return Math.max(0, Math.round(parsed / 5) * 5);
}

export function parseHabitFormData(formData: FormData): HabitInput {
  const frequencyType = String(formData.get('frequencyType') ?? 'daily');

  return {
    title: String(formData.get('title') ?? ''),
    notes: parseOptionalString(formData.get('notes')),
    categoryId: parseOptionalInt(formData.get('categoryId')),
    frequencyType: frequencyType === 'weekly' ? 'weekly' : 'daily',
    targetCount: parseOptionalInt(formData.get('targetCount')) ?? 1,
    pointValue: parsePoints(formData.get('pointValue')),
  };
}
