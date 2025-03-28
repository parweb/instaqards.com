'use server';

import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';

export const setLang = async (prev: string, form: FormData) => {
  const lang = form.get('lang') as string;
  (cookies() as unknown as UnsafeUnwrappedCookies).set('lang', lang);

  return lang;
};
