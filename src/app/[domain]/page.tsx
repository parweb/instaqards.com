import { Link as PrismaLink } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { db } from 'helpers';
import { getSubscription } from 'lib/auth';
import { getSiteData } from 'lib/fetchers';
import { cn } from 'lib/utils';

import 'array-grouping-polyfill';

const LinkItem = (link: PrismaLink) => {
  if (link.type === 'main') {
    return (
      <Link
        href={`/click/${link.id}`}
        target="_blank"
        className={cn(
          'transition-all',
          'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
          'hover:bg-white hover:text-black'
        )}
      >
        {link.label}
      </Link>
    );
  }

  if (link.type === 'social') {
    return (
      <Link href={`/click/${link.id}`} target="_blank">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={cn(
            link.label === 'facebook' && 'h-[65px]',
            link.label !== 'facebook' && 'h-[50px]',
            'object-contain transition-all hover:scale-125'
          )}
          src={link.logo!}
          alt={link.label}
        />
      </Link>
    );
  }

  return <></>;
};

export async function generateStaticParams() {
  const allSites = await db.site.findMany({
    select: {
      subdomain: true,
      customDomain: true
    }
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      },
      customDomain && {
        domain: customDomain
      }
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const site = await getSiteData(domain);

  if (!site) {
    notFound();
  }

  const subscription = await getSubscription({ site });

  if (!subscription.valid()) {
    return (
      <div className="flex items-center justify-center flex-1 self-stretch">
        <div className="max-w-md m-2 p-6 border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Page Temporarily Unavailable
          </h2>

          <p className="text-gray-600 ">
            {"We're sorry for the inconvenience, but this page is currently "}
            {
              "unavailable. We're working to restore access as quickly as possible."
            }
          </p>

          <div>
            <Link
              className="bg-black rounded-md px-3 py-2 text-white"
              href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
            >
              Create your own page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await db.click.create({
    data: {
      siteId: site.id
    }
  });

  const { main, social }: Record<PrismaLink['type'], PrismaLink[]> = {
    main: [],
    social: [],

    ...site.links.groupBy(({ type }: { type: PrismaLink['type'] }) => type)
  };

  const data = {
    links: main,
    socials: social
  };

  return (
    <main className="relative flex-1 self-stretch items-center">
      <div className="absolute inset-0">
        {site?.background?.endsWith('.mp4') && (
          <video
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh]"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={site?.background ?? ''} type="video/mp4" />
          </video>
        )}

        {!site?.background?.endsWith('.mp4') && !!site?.background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh]"
            src={site.background}
            alt="background"
          />
        )}

        <div className="absolute inset-0  bg-black/30" />
      </div>

      <section className="absolute inset-0 flex flex-col p-10">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-3 justify-between flex-1">
          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1">
              {data.links.map(props => (
                <LinkItem key={`LinkItem-${props.id}`} {...props} />
              ))}
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center">
              {data.socials.map(props => (
                <LinkItem key={`LinkItem-${props.id}`} {...props} />
              ))}
            </div>

            <div className="text-center">
              <a
                href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${site.user?.id}`}
                className="text-white"
                target="_blank"
              >
                Get your Qards 🃏
              </a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
