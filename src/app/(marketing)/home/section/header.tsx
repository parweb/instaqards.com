import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';

import { SiteHeader } from 'app/(marketing)/components/site-header';
import { DEFAULT_LANG, Lang } from 'translations';

export const Header = async () => {
  const lang =
    ((await cookies()) as unknown as UnsafeUnwrappedCookies).get('lang')
      ?.value || DEFAULT_LANG;

  return <SiteHeader lang={lang as Lang} />;
};
