import { cookies } from 'next/headers';

import translations, { DEFAULT_LANG, Lang, Part } from '../../translations';

export const translate = (key: Part): string => {
  cookies().get('lang');
  console.log('translate', 'start');
  const lang = (cookies().get('lang')?.value || DEFAULT_LANG) as Lang;
  console.log('translate', { lang: cookies().get('lang')?.value });
  console.log('translate', { 'translations[key]': translations[key] });

  return translations[key][lang];
};
