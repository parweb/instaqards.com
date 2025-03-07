import type { Block, Prisma } from '@prisma/client';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getGoogleFonts, type Font } from 'actions/google-fonts';
import { BlockList } from 'components/BlockItem';
import CreateBlockButton from 'components/create-block-button';
import CreateBlockModal from 'components/modal/create-block';
import UpdateSiteDisplayNameModal from 'components/modal/update-display-name';
import UpdateSiteProfilePictureModal from 'components/modal/update-profile-picture';
import UpdateSiteBackgroundModal from 'components/modal/update-site-background';
import UpdateSiteBackgroundButton from 'components/update-site-background-button';
import UpdateSiteDisplayNameButton from 'components/update-site-displayName-button';
import UpdateSiteProfilePictureButton from 'components/update-site-profile-picture-button';
import { db } from 'helpers';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

const BlockCreate = ({
  type,
  fonts
}: {
  type: Block['type'];
  fonts: Font[];
}) => {
  return (
    <CreateBlockButton type={type}>
      <CreateBlockModal type={type} fonts={fonts} />
    </CreateBlockButton>
  );
};

const Landing = async ({
  site,
  fonts
}: {
  site: Prisma.SiteGetPayload<{ include: { blocks: true } }>;
  fonts: Font[];
}) => {
  const { main, social }: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  const data = { blocks: main, socials: social };

  return (
    <main className="relative flex-1 self-stretch items-center pointer-events-auto">
      <div className="absolute inset-0 group pointer-events-auto">
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

        {!site?.background?.endsWith('.mp4') && !!site?.background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh] transition-all delay-1000 hover:opacity-5"
            src={site.background}
            alt="background"
          />
        )}

        <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      </div>

      <section className="absolute inset-0 flex flex-col p-10 pointer-events-auto">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-3 justify-between flex-1">
          <header className="flex flex-col justify-center items-center gap-3 mt-4">
            <h1 className="text-white text-4xl font-bold relative group">
              {site.display_name}

              <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <UpdateSiteDisplayNameButton>
                  <UpdateSiteDisplayNameModal
                    siteId={site.id}
                    displayName={site.display_name}
                  />
                </UpdateSiteDisplayNameButton>
              </div>
            </h1>

            <div className="group relative bg-white rounded-full overflow-hidden w-24 h-24 cursor-pointer flex items-center justify-center">
              <Image
                priority
                className="object-cover"
                src={site.logo ?? ''}
                alt={site.name ?? ''}
                width={96}
                height={96}
              />

              <div className="absolute inset-0 pointer-events-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <UpdateSiteProfilePictureButton>
                  <UpdateSiteProfilePictureModal siteId={site.id} />
                </UpdateSiteProfilePictureButton>
              </div>
            </div>
          </header>

          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1 pointer-events-auto">
              <BlockList
                blocks={data.blocks}
                site={site}
                type="main"
                fonts={fonts}
              />

              <BlockCreate type="main" fonts={fonts} />
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center pointer-events-auto">
              <BlockList
                blocks={data.socials}
                site={site}
                type="social"
                fonts={fonts}
              />

              <BlockCreate type="social" fonts={fonts} />
            </div>
          </footer>
        </div>
      </section>

      <div className="absolute left-0 right-0 flex items-center justify-center p-4">
        <UpdateSiteBackgroundButton>
          <UpdateSiteBackgroundModal siteId={site.id} />
        </UpdateSiteBackgroundButton>
      </div>
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
    include: { blocks: { orderBy: { position: 'asc' } } }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
  ) {
    notFound();
  }

  const fonts = await getGoogleFonts();

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 flex-1 justify-between">
          <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            {translate('dashboard.site.detail.title', {
              name: site.name ?? ''
            })}
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
          <Landing site={site} fonts={fonts} />
        </Suspense>
      </div>
    </>
  );
}
