import { cookies } from 'next/headers';

import translations, {
  DEFAULT_LANG,
  type Lang,
  type Part
} from '../../translations';

export const getLang = (): Lang => {
  let lang = (cookies().get('lang')?.value || DEFAULT_LANG) as Lang;

  switch (true) {
    case lang.toLowerCase().includes('fr'):
      lang = 'fr';
      break;
    case lang.toLowerCase().includes('en'):
      lang = 'en';
      break;
    case lang.toLowerCase().includes('us'):
      lang = 'en';
      break;
    default:
      lang = 'en';
      break;
  }

  return lang;
};

export const translate = (
  key: Part,
  options: Record<string, string> = {}
): string => {
  const lang = getLang();


  return Object.entries(options).reduce(
    (carry, [key, value]) => carry.replaceAll(`{${key}}`, value),
    (translations?.[key]?.[lang] ?? key) as string
  );
};
