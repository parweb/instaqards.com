import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { FlagPicker } from 'components/flag-picker';
import { Button } from 'components/ui/button';
import { translate } from 'helpers/translate';
import { DEFAULT_LANG } from 'translations';

export const Header = () => {
  const ratio = 0.2;

  return (
    <div className="sticky top-0 bg-white/80 z-10 shadow-md">
      <div className="flex items-center justify-between pr-2 max-w-[1200px] m-auto">
        <Image
          src="/rsz_black-transparent_nolink.png"
          alt="Logo qards.link"
          width={800 * ratio}
          height={400 * ratio}
        />

        <div className="flex items-center gap-2">
          <Link href={`${process.env.NEXTAUTH_URL as string}/register`}>
            <Button>{translate('page.home.register')}</Button>
          </Link>

          <FlagPicker value={cookies().get('lang')?.value || DEFAULT_LANG} />
        </div>
      </div>
    </div>
  );
};
