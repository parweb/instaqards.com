import Cookies from 'js-cookie';
import { useState } from 'react';

import translations, { DEFAULT_LANG, type Lang, type Part } from 'translations';

const useTranslation = () => {
  const [lang, setLang] = useState(
    () => (Cookies.get('lang') || DEFAULT_LANG) as Lang
  );

  let country = lang;

  switch (true) {
    case lang.toLowerCase().includes('fr'):
      country = 'fr';
      break;
    case lang.toLowerCase().includes('en'):
      country = 'en';
      break;
    case lang.toLowerCase().includes('us'):
    case lang.toLowerCase().includes('gb'):
      country = 'en';
      break;
    case lang.toLowerCase().includes('it'):
      country = 'it';
      break;
    case lang.toLowerCase().includes('es'):
      country = 'es';
      break;
    default:
      country = 'en';
      break;
  }

  const handle = (key: Part, options: Record<string, string> = {}) => {
    return Object.entries(options).reduce(
      (carry, [key, value]) => (carry || '').replaceAll(`{${key}}`, value),
      (translations?.[key]?.[country] ?? key) as string
    );
  };

  handle.lang = country;
  handle.setLang = (lang: Lang) => {
    Cookies.set('lang', lang);
    setLang(lang);
  };

  return handle;
};

export default useTranslation;
