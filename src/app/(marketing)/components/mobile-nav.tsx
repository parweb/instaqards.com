'use client';

import { Menu } from 'lucide-react';
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
          className="md:hidden p-1"
          aria-label={translate('menu.landing.label')}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:w-64">
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between mb-4">
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
                className="px-2 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
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
