import type { Block, Prisma } from '@prisma/client';
import { contentType } from 'mime-types';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { BlockList } from 'components/BlockItem';
import CreateBlockButton from 'components/create-block-button';
import { PreviewBackground } from 'components/editor/PreviewBackground';
import CreateBlockModal from 'components/modal/create-block';
import UpdateSiteDescriptionModal from 'components/modal/update-description';
import UpdateSiteDisplayNameModal from 'components/modal/update-display-name';
import UpdateSiteProfilePictureModal from 'components/modal/update-profile-picture';
import UpdateSiteBackgroundModal from 'components/modal/update-site-background';
import UpdateSiteBackgroundButton from 'components/update-site-background-button';
import UpdateSiteDescriptionButton from 'components/update-site-description-button';
import UpdateSiteDisplayNameButton from 'components/update-site-displayName-button';
import UpdateSiteProfilePictureButton from 'components/update-site-profile-picture-button';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSession } from 'lib/auth';

import 'array-grouping-polyfill';

const BlockCreate = ({ type }: { type: Block['type'] }) => {
  return (
    <CreateBlockButton type={type}>
      <CreateBlockModal type={type} />
    </CreateBlockButton>
  );
};

export const Landing = async ({
  site
}: {
  site: Prisma.SiteGetPayload<{ include: { blocks: true } }>;
}) => {
  const { main, social }: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  const data = { blocks: main, socials: social };

  const media_type = site?.background?.startsWith('component:')
    ? 'css'
    : contentType(site?.background?.split('/').pop() ?? '') || '';

  return (
    <main className="relative flex-1 self-stretch items-center flex flex-col pointer-events-auto h-screen">
      <div className="absolute inset-0 group pointer-events-auto">
        {site.background && (
          <>
            {media_type?.startsWith('video/') && (
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                preload="auto"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={site.background} type="video/mp4" />
              </video>
            )}

            {media_type?.startsWith('image/') && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={site.background}
                alt=""
              />
            )}

            {media_type === 'css' && (
              <PreviewBackground name={site.background} />
            )}
          </>
        )}

        {media_type === '' && (
          <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
        )}
      </div>

      <section className="absolute inset-0 flex flex-col px-5 py-10 flex-1 self-stretch pointer-events-auto overflow-y-auto">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-20 justify-between flex-1">
          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1 pointer-events-auto">
              <BlockList blocks={data.blocks} site={site} type="main" />

              <BlockCreate type="main" />
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center pointer-events-auto">
              <BlockList blocks={data.socials} site={site} type="social" />

              <BlockCreate type="social" />
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
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    }
  });

  if (
    !site ||
    (site.userId !== session?.user?.id && session.user.role !== 'ADMIN')
  ) {
    notFound();
  }

  const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center sm:flex-row flex-1 justify-between">
          <h1 className="font-cal text-xl font-bold sm:text-3xl">
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
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 flex items-center gap-2"
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `${site.subdomain}.localhost:11000`}
            <LuArrowUpRight />
          </a>
        </div>

        {/*<CreatePostButton />*/}
      </div>

      <div className="flex flex-col flex-1 self-stretch overflow-y-auto">
        <Suspense fallback={null}>
          <Landing site={site} />
        </Suspense>
      </div>
    </>
  );
}
