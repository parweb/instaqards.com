import { UserRole } from '@prisma/client';
import { eachDayOfInterval } from 'date-fns';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import Analytics, { Tuple } from 'components/analytics';
import { db } from 'helpers/db';
import { getAuth } from 'lib/auth';
import { uri } from 'settings';

import 'array-grouping-polyfill';

export default async function SiteAnalytics(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [auth, site] = await Promise.all([
    getAuth(),
    db.site.findUnique({
      where: { id: decodeURIComponent(params.id) }
    })
  ]);

  if (
    !site ||
    (site.userId !== auth.id &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(auth.role))
  ) {
    notFound();
  }

  const clicks = await db.click.findMany({
    where: {
      OR: [{ siteId: site.id }, { block: { siteId: site.id } }]
    },
    orderBy: { createdAt: 'asc' },
    include: {
      block: true
    }
  });

  const splitByDate = clicks.groupBy(({ createdAt }) =>
    new Date(createdAt).toDateString()
  );

  const start = clicks.at(0)?.createdAt ?? 0;
  const end = new Date();

  const chartdata = eachDayOfInterval({ start, end }).map(date => {
    const key = new Date(date).toDateString();

    const dateClicks = splitByDate?.[key] || [];

    const clicksCount = dateClicks.filter(
      ({ siteId }) => siteId === null
    ).length;

    const visitorsCount = dateClicks.filter(
      ({ blockId }) => blockId === null
    ).length;

    return {
      date: key,
      Clicks: clicksCount,
      Visitors: visitorsCount
    };
  });

  const categories = [
    {
      title: 'components.analytics.block.title',
      subtitle: 'components.analytics.block.subtitle',
      data: Object.entries(
        clicks.reduce(
          (acc, { block }) => {
            if (block) {
              acc[block.id] = (acc[block.id] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([id, value]) => {
        const click = clicks.find(b => b.blockId === id);

        if (!click) {
          return null;
        }

        const block = click.block;

        const hasWidget = !(
          Boolean(block?.widget) === false ||
          Object.keys(block?.widget ?? {}).length === 0
        );

        let name = block?.label;

        if (hasWidget === false) {
        } else {
          // @ts-ignore
          name = block?.widget?.data?.label ?? id;
          // @ts-ignore
          if (block?.widget?.type === 'social' && click.part) {
            name =
              // @ts-ignore
              block?.widget?.data.socials.find(({ id }) => id === click.part)
                ?.logo ?? name;
          }

          if (
            // @ts-ignore
            block?.widget?.type === 'picture' &&
            // @ts-ignore
            ['gallery', 'apple-watch', 'bento'].includes(block?.widget?.id)
          ) {
            name =
              // @ts-ignore
              block?.widget?.data?.medias.find(({ id }) => id === click.part)
                ?.link ?? name;
          }
        }

        return { name, value };
      }) as Tuple[]
    },
    {
      title: 'components.analytics.source.title',
      subtitle: 'components.analytics.source.subtitle',
      data: Object.entries(
        clicks.reduce(
          (acc, { request }) => {
            // @ts-ignore
            const referrer = request?.headers?.['referer'];

            if (referrer) {
              acc[referrer] = (acc[referrer] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([name, value]) => {
        return { name, value };
      }) as Tuple[]
    },
    {
      title: 'components.analytics.country.title',
      subtitle: 'components.analytics.country.subtitle',
      data: Object.entries(
        clicks.reduce(
          (acc, { request }) => {
            // @ts-ignore
            const country = request?.headers?.['x-vercel-ip-country'];

            if (country) {
              acc[country] = (acc[country] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([name, value]) => {
        return { name, value, code: name };
      }) as Tuple[]
    }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 self-stretch p-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <h1 className="font-cal text-xl font-bold sm:text-3xl">
          Analytics for {site.name}
        </h1>

        <a
          href={uri.site(site).link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {uri.site(site).title}
          <LuArrowUpRight />
        </a>
      </div>

      <Suspense fallback={null}>
        <Analytics chartdata={chartdata} categories={categories} />
      </Suspense>
    </div>
  );
}
