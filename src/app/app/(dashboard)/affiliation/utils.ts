import { type DateRange } from 'components/ui/date-picker';

export const parser = {
  parse(queryValue: string): DateRange | null {
    if (!queryValue) return null;

    try {
      const parsed = JSON.parse(queryValue);

      if (parsed && parsed.from && parsed.to) {
        const from = new Date(parsed.from);
        const to = new Date(parsed.to);
        if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
          return { from, to };
        }
      }
    } catch (e) {
      console.error('Failed to parse date range from query param:', e);
      return null;
    }

    return null;
  },
  serialize(value: DateRange | null): string {
    if (!value || !(value.from instanceof Date) || !(value.to instanceof Date))
      return '';

    return JSON.stringify({
      from: value.from.toISOString(),
      to: value.to.toISOString()
    });
  }
};
