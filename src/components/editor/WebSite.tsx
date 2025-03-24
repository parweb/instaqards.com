import type { Block, Prisma } from '@prisma/client';
import { contentType } from 'mime-types';

import { BlockList } from 'components/BlockItem';
import CreateBlockButton from 'components/create-block-button';
import { PreviewBackground } from 'components/editor/PreviewBackground';
import CreateBlockModal from 'components/modal/create-block';
import UpdateSiteBackgroundModal from 'components/modal/update-site-background';
import UpdateSiteBackgroundButton from 'components/update-site-background-button';
import { Background } from 'components/editor/website/background';

import 'array-grouping-polyfill';

const BlockCreate = ({ type }: { type: Block['type'] }) => {
  return (
    <CreateBlockButton type={type}>
      <CreateBlockModal type={type} />
    </CreateBlockButton>
  );
};

export const WebSite = ({
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

  return (
    <main className="relative flex-1 self-stretch items-center flex flex-col pointer-events-auto h-screen">
      <Background editor background={site.background} />

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
