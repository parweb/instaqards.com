'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';
import { uri } from 'settings';
import { DEFAULT_LANG, Lang } from 'translations';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

interface SiteHeaderProps {
  lang: Lang;
}

const navigationItems = [
  {
    title: { fr: 'Accueil', en: 'Home', it: 'Home', es: 'Home' },
    href: '/'
  },
  {
    title: { fr: 'Explorer', en: 'Explore', it: 'Esplora', es: 'Explorar' },
    href: '/explore'
  },
  {
    title: { fr: 'Qards', en: 'Qards', it: 'Qards', es: 'Qards' },
    items: [
      {
        title: {
          fr: 'Qards du mois',
          en: 'Qards of the month',
          it: 'Qards del mese',
          es: 'Qards del mes'
        },
        href: '/qards/top',
        description: {
          fr: 'Découvrez les meilleures qards du mois',
          en: 'Discover the best qards of the month',
          it: 'Scopri le migliori qards del mese',
          es: 'Descubre las mejores qards del mes'
        },
        background: '/assets/podium-qards.png'
      },
      {
        title: {
          fr: 'Créer une qard',
          en: 'Create a qard',
          it: 'Crea una qard',
          es: 'Crear una qard'
        },
        href: '/pro',
        description: {
          fr: 'Créez votre propre qard personnalisée',
          en: 'Create your own personalized qard',
          it: 'Crea il tuo qard personalizzato',
          es: 'Crea tu propio qard personalizado'
        },
        background: '/assets/create-qard.png'
      }
    ]
  }
];

const mobileLinks = navigationItems.flatMap(item => {
  if (item.items) {
    return item.items.map(item => ({
      label: item.title,
      href: item.href
    }));
  }

  return [
    {
      label: item.title,
      href: item.href
    }
  ];
});

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  lang = DEFAULT_LANG
}) => {
  const ratio = 0.2;

  const translate = useTranslation();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white/80 px-4 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav
            links={mobileLinks.map(link => ({
              ...link,
              label: link.label[lang]
            }))}
            lang={lang}
          />

          <Link prefetch href="/" className="flex items-center justify-center">
            <Image
              src="/rsz_black-transparent_nolink.png"
              alt="Logo qards.link"
              width={800 * ratio}
              height={400 * ratio}
            />
          </Link>
        </div>

        <MainNav items={navigationItems} lang={lang} />

        <div>
          <Link prefetch href={uri.app('/register')}>
            <Button>{translate('page.home.header.cta')}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
