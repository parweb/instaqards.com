'use client';

import { LuMenu } from 'react-icons/lu';
import Link from 'next/link';
import * as React from 'react';

import { FlagPicker } from 'components/flag-picker';
import { Button } from 'components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'components/ui/sheet';
import useTranslation from 'hooks/use-translation';
import { DEFAULT_LANG, Lang } from 'translations';

interface MobileNavProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  lang: Lang;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  links,
  lang = DEFAULT_LANG
}) => {
  const [open, setOpen] = React.useState(false);
  const translate = useTranslation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 md:hidden"
          aria-label={translate('menu.landing.label')}
        >
          <LuMenu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:w-64">
        <div className="mt-8 flex flex-col gap-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-semibold">
              {translate('menu.landing.name')}
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map(link => (
              <Link
                prefetch
                key={link.href}
                href={link.href}
                className="hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {translate('menu.landing.language')}
              </span>

              <FlagPicker value={lang} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
