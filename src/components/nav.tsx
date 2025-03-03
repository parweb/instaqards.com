'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings
} from 'lucide-react';

import { LanguageChooser } from 'components/LanguageChooser';
import useTranslation from 'hooks/use-translation';

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const translate = useTranslation();

  const tabs = useMemo(() => {
    const help = {
      name: translate('menu.help'),
      href: '/help',
      icon: <HelpCircle width={18} />
    };

    if (segments[0] === 'site' && id) {
      return [
        {
          name: translate('menu.back.site'),
          href: '/sites',
          icon: <ArrowLeft width={18} />
        },
        {
          name: translate('menu.design'),
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />
        },
        {
          name: translate('menu.analytics'),
          href: `/site/${id}/analytics`,
          isActive: segments.includes('analytics'),
          icon: <BarChart3 width={18} />
        },
        {
          name: translate('menu.settings'),
          href: `/site/${id}/settings`,
          isActive: segments.includes('settings'),
          icon: <Settings width={18} />
        },
        help
      ];
    }

    return [
      {
        name: translate('menu.overview'),
        href: '/',
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />
      },
      {
        name: translate('menu.sites'),
        href: '/sites',
        isActive: segments[0] === 'sites',
        icon: <Globe width={18} />
      },
      {
        name: translate('menu.affiliation'),
        href: '/affiliation',
        isActive: segments[0] === 'affiliation',
        icon: <DollarSign width={18} />
      },
      {
        name: translate('menu.settings'),
        href: '/settings',
        isActive: segments[0] === 'settings',
        icon: <Settings width={18} />
      },
      help
    ];
  }, [translate, segments, id]);

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  const ratio = 0.2;

  return (
    <>
      <button
        type="button"
        className="fixed z-20 right-5 top-7 sm:hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>

      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed z-20 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <Link
              href="/"
              className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-3 uppercase"
            >
              <Image
                src="/rsz_black-transparent_nolink.png"
                alt="Logo qards.link"
                width={800 * ratio}
                height={400 * ratio}
              />
            </Link>
          </div>

          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? 'bg-stone-200 text-black dark:bg-stone-700' : ''
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}

            <div>
              <LanguageChooser />
            </div>
          </div>
        </div>

        <div>
          <div className="grid gap-1" />
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
