'use client';

import type { Prisma, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import * as React from 'react';

import {
  BarChart3,
  Calendar,
  Cog,
  DollarSign,
  Frame,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  LinkIcon,
  Newspaper,
  Send,
  Settings,
  Users,
  Workflow
} from 'lucide-react';

import { NavMain } from 'components/nav-main';
import { NavProjects } from 'components/nav-projects';
import { NavSecondary } from 'components/nav-secondary';
import useTranslation from 'hooks/use-translation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from 'components/ui/sidebar';

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar> & {
    role: User['role'];
    sites: Prisma.SiteGetPayload<{
      include: {
        clicks: true;
        subscribers: true;
        blocks: { include: { reservations: true } };
      };
    }>[];
  }
) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const translate = useTranslation();

  const openProject = props.sites.find(site => site.id === id);

  const data = {
    navMain: [
      {
        title: translate('menu.overview'),
        url: '/',
        icon: LayoutDashboard,
        isActive: segments.length === 0
      },
      {
        title: translate('menu.sites'),
        url: '/sites',
        icon: Globe,
        isActive: segments[0] === 'sites'
      },
      {
        title: translate('menu.links'),
        url: '/links',
        icon: LinkIcon,
        isActive: segments[0] === 'links'
      },
      {
        title: translate('menu.affiliation'),
        url: '/affiliation',
        icon: DollarSign,
        isActive: segments[0] === 'affiliation'
      },
      ...(props.role === 'ADMIN'
        ? [
            {
              title: translate('menu.generator'),
              url: '/generator',
              icon: Cog,
              isActive: segments[0] === 'generator'
            },
            {
              title: translate('menu.referals'),
              url: '/referals',
              icon: Workflow,
              isActive: segments[0] === 'referals'
            }
          ]
        : [])
    ],
    navSecondary: [
      {
        title: translate('menu.support'),
        url: '/help',
        icon: LifeBuoy,
        isActive: segments[0] === 'help'
      },
      {
        title: translate('menu.feedback'),
        url: '/feedback',
        icon: Send,
        isActive: false
      }
    ],
    projects: props.sites
      .filter(site => (id ? site.id !== id : true))
      .map(site => {
        const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
        const secondaryUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
          ? `https://${url}`
          : `http://${site.subdomain}.localhost:11000`;

        return {
          name: site.name ?? 'Untitled',
          url: `/site/${site.id}`,
          icon: Frame,
          secondaryUrl,
          clicks: site.clicks.length
        };
      })
  };

  const url = `${openProject?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const secondaryUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${url}`
    : `http://${openProject?.subdomain}.localhost:11000`;

  const project = openProject
    ? {
        title: openProject.name ?? 'Untitled',
        url: `/site/${openProject.id}`,
        secondaryUrl,
        icon: Frame,
        isActive: true,
        items: [
          {
            title: translate('menu.design'),
            url: `/site/${openProject.id}`,
            isActive: segments.length === 2,
            icon: Newspaper
          },
          {
            title: translate('menu.subscribers'),
            url: `/site/${openProject.id}/subscribers`,
            isActive: segments.includes('subscribers'),
            icon: Users,
            count: openProject.subscribers.length
          },
          {
            title: translate('menu.reservations'),
            url: `/site/${openProject.id}/reservations`,
            isActive: segments.includes('reservations'),
            icon: Calendar,
            count: openProject.blocks.reduce(
              (carry, block) => carry + (block?.reservations?.length ?? 0),
              0
            )
          },
          {
            title: translate('menu.analytics'),
            url: `/site/${openProject.id}/analytics`,
            isActive: segments.includes('analytics'),
            icon: BarChart3,
            count: openProject.clicks.length
          },
          {
            title: translate('menu.settings'),
            url: `/site/${openProject.id}/settings`,
            isActive: segments.includes('settings'),
            icon: Settings
          }
        ]
      }
    : null;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-col items-stretch justify-center p-1">
        <Link
          href="/"
          className="rounded-lg px-2 flex items-center justify-center gap-3 uppercase"
          style={{
            backgroundImage: 'url("/assets/bg-logo.png")',

            backgroundPosition: '80px 80px',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Image
            src="/rsz_transparent_nolink.png"
            alt="Logo qards.link"
            width={800 * 0.2}
            height={400 * 0.2}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {project && <NavMain dark label="Qard" items={[project]} />}
        <NavMain label="Platform" items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>{props.children}</SidebarFooter>
    </Sidebar>
  );
}
