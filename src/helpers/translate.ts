import { cookies } from 'next/headers';

import translations, { DEFAULT_LANG, Lang, Part } from '../../translations';

export const translate = (
  key: Part,
  options: Record<string, string> = {}
): string => {
  const lang = (cookies().get('lang')?.value || DEFAULT_LANG) as Lang;

  return Object.entries(options).reduce(
    (carry, [key, value]) => carry.replaceAll(`{${key}}`, value),
    (translations?.[key]?.[lang] ?? key) as string
  );
};
