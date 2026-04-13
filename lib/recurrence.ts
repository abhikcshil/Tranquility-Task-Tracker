export type RecurrenceDescription = {
  label: string;
  details: string;
};

export type RecurringType = 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'yearly';

export function describeRecurringRule(type: RecurringType, frequency?: number | null): RecurrenceDescription {
  const normalizedFrequency = frequency && frequency > 0 ? frequency : 1;

  switch (type) {
    case 'daily':
      return {
        label: 'Daily',
        details: normalizedFrequency === 1 ? 'Every day' : `Every ${normalizedFrequency} days`,
      };
    case 'weekdays':
      return {
        label: 'Weekdays',
        details: 'Monday through Friday',
      };
    case 'weekly':
      return {
        label: 'Weekly',
        details: normalizedFrequency === 1 ? 'Every week' : `Every ${normalizedFrequency} weeks`,
      };
    case 'monthly':
      return {
        label: 'Monthly',
        details: normalizedFrequency === 1 ? 'Every month' : `Every ${normalizedFrequency} months`,
      };
    case 'yearly':
      return {
        label: 'Yearly',
        details: normalizedFrequency === 1 ? 'Every year' : `Every ${normalizedFrequency} years`,
      };
    default:
      return {
        label: 'Recurring',
        details: 'Custom schedule',
      };
  }
}
