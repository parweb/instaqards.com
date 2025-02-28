'use server';

import { cookies } from 'next/headers';

export const setLang = async (prev: string, form: FormData) => {
  const cookieStore = await cookies();
  const lang = form.get('lang') as string;
  cookieStore.set('lang', lang);

  return lang
};
