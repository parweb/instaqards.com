'use client';

import { UserRole } from '@prisma/client';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments
} from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  BarChart3,
  Calendar,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  Link as LinkIcon,
  Search,
  Settings,
  Users
} from 'lucide-react';

import { QardIcon } from 'components/icons/qard-icon';
import { useCurrentRole } from 'hooks/use-current-role';
import useTranslation from 'hooks/use-translation';
import { cn } from 'lib/utils';

interface MobileBottomNavProps {
  isMarketing?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  isMarketing = false
}) => {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const translate = useTranslation();
  const role = useCurrentRole();

  const marketingTabs = useMemo(
    () => [
      {
        name: 'Accueil',
        href: '/',
        icon: <Home className="h-5 w-5" />,
        isActive: pathname === '/'
      },
      {
        name: 'Explorer',
        href: '/explore',
        icon: <Search className="h-5 w-5" />,
        isActive: pathname.startsWith('/explore')
      },
      {
        name: 'Qards',
        href: '/qards/top',
        icon: <QardIcon className="h-5 w-5" />,
        isActive: pathname.startsWith('/qards')
      },
      {
        name: translate('page.home.header.cta') || 'Créer',
        href: '/pro',
        icon: <LayoutDashboard className="h-5 w-5" />,
        isActive: pathname.startsWith('/pro')
      }
    ],
    [translate, pathname]
  );

  const appTabs = useMemo(() => {
    // Si on est dans une page de site spécifique
    if (segments[0] === 'site' && id) {
      return [
        {
          name: translate('menu.design'),
          href: `/site/${id}`,
          icon: <LayoutDashboard className="h-5 w-5" />,
          isActive: segments.length === 2
        },
        {
          name: translate('menu.subscribers'),
          href: `/site/${id}/subscribers`,
          icon: <Users className="h-5 w-5" />,
          isActive: segments.includes('subscribers')
        },
        {
          name: translate('menu.analytics'),
          href: `/site/${id}/analytics`,
          icon: <BarChart3 className="h-5 w-5" />,
          isActive: segments.includes('analytics')
        },
        {
          name: translate('menu.settings'),
          href: `/site/${id}/settings`,
          icon: <Settings className="h-5 w-5" />,
          isActive: segments.includes('settings')
        }
      ];
    }

    // Navigation principale de l'app
    return [
      {
        name: translate('menu.overview'),
        href: '/',
        icon: <LayoutDashboard className="h-5 w-5" />,
        isActive: segments.length === 0
      },
      {
        name: translate('menu.sites'),
        href: '/sites',
        icon: <Globe className="h-5 w-5" />,
        isActive: segments[0] === 'sites'
      },
      {
        name: translate('menu.links'),
        href: '/links',
        icon: <LinkIcon className="h-5 w-5" />,
        isActive: segments[0] === 'links'
      },
      {
        name: translate('menu.settings'),
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
        isActive: segments[0] === 'settings'
      }
    ];
  }, [translate, segments, id, role]);

  const tabs = isMarketing ? marketingTabs : appTabs;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Ne pas afficher sur desktop
  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm md:hidden">
      <div className="safe-area-pb flex items-center justify-around px-1 py-1">
        {tabs.map(({ name, href, icon, isActive }) => (
          <Link
            key={name}
            href={href}
            onClick={() => {
              // Vibration tactile sur mobile
              if ('vibrate' in navigator) {
                navigator.vibrate(50);
              }
            }}
            className={cn(
              'relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 transition-all duration-200',
              isActive
                ? 'scale-105 bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
            )}
          >
            {isActive && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-600" />
            )}
            <div
              className={cn(
                'mb-1 transition-transform duration-200',
                isActive ? 'scale-110' : ''
              )}
            >
              {icon}
            </div>
            <span
              className={cn(
                'max-w-full truncate text-xs font-medium transition-all duration-200',
                isActive ? 'font-semibold' : ''
              )}
            >
              {name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
