import { subDays } from 'date-fns';

import { type DateRange } from 'components/ui/date-picker';

export const rangeParser = {
  parse(queryValue: string): DateRange | null {
    if (!queryValue) return { from: subDays(new Date(), 7), to: new Date() };

    try {
      const parsed = JSON.parse(queryValue);

      if (parsed && parsed.from && parsed.to) {
        const from = new Date(parsed.from);
        const to = new Date(parsed.to);
        if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
          console.log('yolo', { from, to });
          return { from, to };
        }
      }
    } catch (e) {
      console.error('Failed to parse date range from query param:', e);
      return { from: subDays(new Date(), 7), to: new Date() };
    }

    console.log('yolo2', { from: subDays(new Date(), 7), to: new Date() });
    return { from: subDays(new Date(), 7), to: new Date() };
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
