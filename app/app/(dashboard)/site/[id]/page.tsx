import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Posts from '@/components/posts';
import CreatePostButton from '@/components/create-post-button';
import { cn } from '@/lib/utils';
import { LuTrash2, LuPencil } from 'react-icons/lu';
import DeleteLinkButton from '@/components/delete-link-button';
import UpdateLinkButton from '@/components/update-link-button';
import UpdateLinkModal from '@/components/modal/update-link';
import { Prisma, Link, Site } from '@prisma/client';
import { Suspense } from 'react';
import CreateLinkButton from '@/components/create-link-button';
import CreateLinkModal from '@/components/modal/create-link';

import 'array-grouping-polyfill';

const LinkUpdate = (link: Link) => {
  return (
    <UpdateLinkButton>
      <UpdateLinkModal {...link} />
    </UpdateLinkButton>
  );
};

const LinkDelete = (link: Link) => {
  return <DeleteLinkButton {...link} />;
};

const LinkCreate = ({ type }: { type: Link['type'] }) => {
  return (
    <CreateLinkButton type={type}>
      <CreateLinkModal type={type} />
    </CreateLinkButton>
  );
};

const LinkItem = (link: Link) => {
  if (link.type === 'main') {
    return (
      <div className="group flex flex-1 items-center gap-2 relative">
        <a
          className={cn(
            'transition-all',
            'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
            'hover:bg-white hover:text-black'
          )}
        >
          {link.label}
        </a>

        <div className="absolute right-10 flex gap-2 items-center p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:right-0">
          <LinkUpdate {...link} />
          <LinkDelete {...link} />
        </div>
      </div>
    );
  }

  if (link.type === 'social') {
    return (
      <div className="group flex flex-col flex-1 items-center gap-2 relative">
        <div className="flex gap-2 absolute items-center p-2 transition-all opacity-0 group-hover:opacity-100 bottom-[100%]">
          <LinkUpdate {...link} />
          <LinkDelete {...link} />
        </div>
        <a target="_blank">
          <img
            className={cn(
              link.label === 'facebook' && 'h-[65px]',
              link.label !== 'facebook' && 'h-[50px]',
              'object-contain transition-all hover:scale-125'
            )}
            src={link.logo!}
            alt={link.label}
          />
        </a>
      </div>
    );
  }

  return <></>;
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
      <div className="absolute inset-0">
        <video
          className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh]"
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://gellyx.fr/video/2.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0  bg-black/30" />
      </div>

      <section className="absolute inset-0 flex flex-col p-10">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-3 justify-between flex-1">
          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1">
              {data.links.map(props => (
                <LinkItem key={`LinkItem-${props.id}`} {...props} />
              ))}

              <LinkCreate type="main" />
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center">
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

  const site = await prisma.site.findUnique({
    where: { id: decodeURIComponent(params.id) },
    include: { links: true }
  });

  if (!site || site.userId !== session.user.id) {
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
                : `http://${site.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
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
