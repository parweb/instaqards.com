import { Link, Site } from '@prisma/client';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import LinkItem from 'components/LinkItem';
import CreateLinkButton from 'components/create-link-button';
import CreateLinkModal from 'components/modal/create-link';
import UpdateBackgroundSite from 'components/update-background-site';
import { db } from 'helpers';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

const LinkCreate = ({ type }: { type: Link['type'] }) => {
  return (
    <CreateLinkButton type={type}>
      <CreateLinkModal type={type} />
    </CreateLinkButton>
  );
};

const Landing = async ({ site }: { site: Site & { links: Link[] } }) => {
  const { main, social }: Record<Link['type'], Link[]> = {
    main: [],
    social: [],

    ...site.links.groupBy(({ type }: { type: Link['type'] }) => type)
  };

  const data = {
    links: main,
    socials: social
  };

  return (
    <main className="relative flex-1 self-stretch items-center">
      <div className="absolute inset-0 group">
        {site?.background?.endsWith('.mp4') && (
          <video
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh] transition-all delay-1000 hover:opacity-5"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={site?.background ?? ''} type="video/mp4" />
          </video>
        )}

        {!site?.background?.endsWith('.mp4') && (
          <Image
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh] transition-all delay-1000 hover:opacity-5"
            src={site?.background ?? ''}
            alt="background"
          />
        )}

        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        <div className="z-10 opacity-0 absolute inset-0 transition-all delay-1000 group-hover:opacity-100 flex items-center justify-center pointer-events-none text-5xl uppercase">
          <UpdateBackgroundSite siteId={site.id} />
        </div>
      </div>

      <section className="absolute inset-0 flex flex-col p-10 pointer-events-none">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-3 justify-between flex-1">
          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1 pointer-events-auto">
              {data.links.map(props => (
                <LinkItem key={`LinkItem-${props.id}`} {...props} />
              ))}

              <LinkCreate type="main" />
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center pointer-events-auto">
              {data.socials.map(props => (
                <LinkItem key={`LinkItem-${props.id}`} {...props} />
              ))}

              <LinkCreate type="social" />
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default async function SitePosts({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const site = await db.site.findUnique({
    where: { id: decodeURIComponent(params.id) },
    include: {
      links: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!site || site.userId !== session?.user?.id) {
    notFound();
  }

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 flex-1 justify-between">
          <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            Configure {site.name} design
          </h1>

          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${site.subdomain}.localhost:11000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `${site.subdomain}.localhost:11000`}
            ↗
          </a>
        </div>

        {/*<CreatePostButton />*/}
      </div>

      <div className="flex flex-col h-[100vh]">
        <Suspense fallback={null}>
          {/* @ts-ignore */}
          <Landing site={site} />
        </Suspense>
      </div>
    </>
  );
}
