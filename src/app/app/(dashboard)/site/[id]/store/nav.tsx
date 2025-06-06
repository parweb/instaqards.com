'use client';

import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { cn } from 'lib/utils';

export default function StoreNav(props: {
  site: Prisma.SiteGetPayload<{
    select: { id: true; name: true; userId: true; subdomain: true };
  }>;
}) {
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: 'Dashboard',
      href: `/site/${props.site.id}/store`,
      segment: null
    },
    {
      name: 'Orders',
      href: `/site/${props.site.id}/store/orders`,
      segment: 'orders'
    },
    {
      name: 'Products',
      href: `/site/${props.site.id}/store/products`,
      segment: 'products'
    }
    // {
    //   name: 'Categories',
    //   href: `/site/${props.site.id}/store/categories`,
    //   segment: 'categories'
    // },
    // {
    //   name: 'Settings',
    //   href: `/site/${props.site.id}/store/settings`,
    //   segment: 'settings'
    // }
  ];

  return (
    <div className="flex space-x-4 border-b border-stone-200 pt-2 pb-4 dark:border-stone-700">
      {navItems.map(item => (
        <Link
          prefetch
          key={item.name}
          href={item.href}
          // Change style depending on whether the link is active
          className={cn(
            'rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-stone-200 dark:active:bg-stone-600',
            segment === item.segment
              ? 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
