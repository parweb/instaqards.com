import { cookies } from 'next/headers';

import translations, { DEFAULT_LANG, Lang, Part } from '../../translations';

export const translate = (key: Part): string => {
  const lang = (cookies().get('lang')?.value || DEFAULT_LANG) as Lang;

  return translations?.[key]?.[lang] ?? key;
};
