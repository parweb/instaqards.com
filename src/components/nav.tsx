'use client';

import { UserRole } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  LuArrowLeft,
  LuCalendar,
  LuChartColumn,
  LuCircleHelp,
  LuCog,
  LuDollarSign,
  LuGlobe,
  LuLayoutDashboard,
  LuLink,
  LuMenu,
  LuNewspaper,
  LuSettings,
  LuUsers,
  LuX
} from 'react-icons/lu';

import { LanguageChooser } from 'components/LanguageChooser';
import { useCurrentRole } from 'hooks/use-current-role';
import useTranslation from 'hooks/use-translation';

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const translate = useTranslation();

  const role = useCurrentRole();

  const tabs = useMemo(() => {
    const help = {
      name: translate('menu.help'),
      href: '/help',
      icon: <LuCircleHelp width={18} />
    };

    if (segments[0] === 'site' && id) {
      return [
        {
          name: translate('menu.back.site'),
          href: '/sites',
          icon: <LuArrowLeft width={18} />
        },
        {
          name: translate('menu.design'),
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <LuNewspaper width={18} />
        },
        {
          name: translate('menu.subscribers'),
          href: `/site/${id}/subscribers`,
          isActive: segments.includes('subscribers'),
          icon: <LuUsers width={18} />
        },
        {
          name: translate('menu.reservations'),
          href: `/site/${id}/reservations`,
          isActive: segments.includes('reservations'),
          icon: <LuCalendar width={18} />
        },
        {
          name: translate('menu.analytics'),
          href: `/site/${id}/analytics`,
          isActive: segments.includes('analytics'),
          icon: <LuChartColumn width={18} />
        },
        {
          name: translate('menu.settings'),
          href: `/site/${id}/settings`,
          isActive: segments.includes('settings'),
          icon: <LuSettings width={18} />
        },
        help
      ];
    }

    return [
      {
        name: translate('menu.overview'),
        href: '/',
        isActive: segments.length === 0,
        icon: <LuLayoutDashboard width={18} />
      },
      {
        name: translate('menu.sites'),
        href: '/sites',
        isActive: segments[0] === 'sites',
        icon: <LuGlobe width={18} />
      },
      {
        name: translate('menu.links'),
        href: '/links',
        isActive: segments[0] === 'links',
        icon: <LuLink width={18} />
      },
      ...(([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
        role ?? UserRole.USER
      )
        ? [
            {
              name: translate('menu.generator'),
              href: '/generator',
              isActive: segments[0] === 'generator',
              icon: <LuCog width={18} />
            }
          ]
        : []),
      {
        name: translate('menu.affiliation'),
        href: '/affiliation',
        isActive: segments[0] === 'affiliation',
        icon: <LuDollarSign width={18} />
      },
      {
        name: translate('menu.settings'),
        href: '/settings',
        isActive: segments[0] === 'settings',
        icon: <LuSettings width={18} />
      },
      help
    ];
  }, [translate, segments, id, role]);

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  const ratio = 0.2;

  return (
    <>
      <button
        type="button"
        className="fixed top-5 right-5 sm:hidden"
        onClick={() => setShowSidebar(state => !state)}
      >
        {showSidebar ? <LuX width={20} /> : <LuMenu width={20} />}
      </button>

      <nav
        onClick={() => setShowSidebar(false)}
        onKeyUp={e => e.key === 'Enter' && setShowSidebar(false)}
        className={`transform ${
          showSidebar
            ? 'h-full w-full translate-x-0 bg-gray-500/50 pr-[100px] sm:pr-0'
            : '-translate-x-full'
        } fixed flex flex-col justify-between gap-4 transition-all sm:static sm:w-60 sm:translate-x-0`}
      >
        <div
          onClick={e => e.stopPropagation()}
          onKeyUp={e => e.stopPropagation()}
          className="pointer-events-auto flex h-full w-full flex-col justify-between gap-4 border-r border-stone-200 bg-stone-100 p-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center rounded-lg p-2">
              <Link
                prefetch
                href="/"
                className="flex items-center gap-3 rounded-lg p-2 uppercase hover:bg-stone-200"
              >
                <Image
                  src="/rsz_black-transparent_nolink.png"
                  alt="Logo qards.link"
                  width={800 * ratio}
                  height={400 * ratio}
                />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {tabs.map(({ name, href, isActive, icon }) => (
                <Link
                  prefetch
                  key={name}
                  href={href}
                  className={`flex items-center gap-2 ${
                    isActive ? 'bg-stone-200 text-black' : ''
                  } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300`}
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

          <div className="flex flex-col gap-4">
            <div className="border-t border-stone-200" />

            {children}
          </div>
        </div>
      </nav>
    </>
  );
}
