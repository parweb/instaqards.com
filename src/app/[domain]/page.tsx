import type { Block } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSubscription } from 'lib/auth';
import { getSiteData } from 'lib/fetchers';
import { BlockList } from './client';

import 'array-grouping-polyfill';
import { contentType } from 'mime-types';

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
            {translate('page.public.site.title')}
          </h2>

          <p className="text-gray-600 ">
            {translate('page.public.site.description')}
          </p>

          <div>
            <Link
              className="bg-black rounded-md px-3 py-2 text-white"
              href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
            >
              {translate('page.public.site.create')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await db.click.create({ data: { siteId: site.id } });

  const { main, social }: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  const data = { blocks: main, socials: social };

  const media_type =
    contentType(site?.background?.split('/').pop() ?? '') || '';

  return (
    <main className="relative flex-1 self-stretch items-center flex flex-col">
      <div className="absolute inset-0">
        {media_type?.startsWith('video/') && (
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

        {!media_type?.startsWith('video/') && !!site?.background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh]"
            src={site.background}
            alt=""
          />
        )}

        <div className="absolute inset-0  bg-black/30" />
      </div>

      <section className="flex flex-col p-10 flex-1 self-stretch">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-20 justify-between flex-1">
          <header className="flex flex-col justify-center items-center gap-6  pt-4">
            <div className="bg-white rounded-full overflow-hidden w-24 h-24 flex items-center justify-center">
              <Image
                priority
                className="object-cover"
                src={site.logo ?? ''}
                alt={site.name ?? ''}
                width={96}
                height={96}
              />
            </div>

            <h1 className="text-white text-4xl font-bold">{site.name}</h1>

            <div className="">
              <p className="text-center whitespace-pre-wrap">
                {site.description}
              </p>
            </div>
          </header>

          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1">
              <BlockList blocks={data.blocks} />
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center">
              <BlockList blocks={data.socials} />
            </div>

            <div className="text-center">
              <a
                href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${site.user?.id}`}
                className="text-white"
                target="_blank"
                rel="noreferrer"
              >
                {translate('page.public.site.ads')}
              </a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
