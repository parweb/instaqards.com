import Cookies from 'js-cookie';
import { useState } from 'react';

import translations, { DEFAULT_LANG, Lang, Part } from '../../translations';

const useTranslation = () => {
  const [lang, setLang] = useState(
    () => (Cookies.get('lang') || DEFAULT_LANG) as Lang
  );

  const handle = (key: Part) => {
    console.log('translate', { lang });
    console.log('translate', { 'translations[key]': translations[key] });

    return translations[key][lang];
  };

  handle.lang = lang;
  handle.setLang = (lang: Lang) => {
    Cookies.set('lang', lang);
    setLang(lang);
  };

  return handle;
};

export default useTranslation;
