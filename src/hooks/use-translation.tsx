import Cookies from 'js-cookie';
import { useState } from 'react';

import translations, { DEFAULT_LANG, Lang, Part } from '../../translations';

const useTranslation = () => {
  const [lang, setLang] = useState(
    () => (Cookies.get('lang') || DEFAULT_LANG) as Lang
  );

  const handle = (key: Part, options: Record<string, string> = {}) => {
    return Object.entries(options).reduce(
      (carry, [key, value]) => (carry || '').replaceAll(`{${key}}`, value),
      (translations?.[key]?.[lang] ?? key) as string
    );
  };

  handle.lang = lang;
  handle.setLang = (lang: Lang) => {
    Cookies.set('lang', lang);
    setLang(lang);
  };

  return handle;
};

export default useTranslation;
