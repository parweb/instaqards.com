'use server';

import { cookies } from 'next/headers';

export const setLang = (prev: string, form: FormData) => {
  const lang = form.get('lang') as string;
  cookies().set('lang', lang);

  return lang;
};
