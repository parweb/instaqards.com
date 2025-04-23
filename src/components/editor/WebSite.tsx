'use client';

import type { Block, Prisma, Site } from '@prisma/client';
import { AnimatePresence } from 'motion/react';
import { Eye, Pencil } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';

import { BlockList } from 'components/BlockItem';
import CreateBlockButton from 'components/create-block-button';
import CreateBlockModal from 'components/modal/create-block';
import UpdateSiteBackgroundModal from 'components/modal/update-site-background';
import { Button } from 'components/ui/button';
import UpdateSiteBackgroundButton from 'components/update-site-background-button';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { cn } from 'lib/utils';

import 'array-grouping-polyfill';

const BlockCreate = ({
  type,
  siteId
}: {
  type: Block['type'];
  siteId: Site['id'];
}) => {
  return (
    <CreateBlockButton type={type}>
      <CreateBlockModal type={type} siteId={siteId} />
    </CreateBlockButton>
  );
};

const Inner = ({
  preview,
  setPreview,
  data,
  site
}: {
  preview: boolean;
  setPreview: Dispatch<SetStateAction<boolean>>;
  data: Record<Block['type'], Block[]>;
  site: Site;
}) => {
  return (
    <Wrapper className={cn(preview === true && 'fixed inset-0 z-10')}>
      <Background background={site.background} />

      <Content>
        <Main length={data.main.length}>
          <AnimatePresence>
            <BlockList
              editor={!preview}
              blocks={data.main}
              site={site}
              type="main"
            />
          </AnimatePresence>

          <div className="flex gap-2 items-center justify-center">
            {preview === false && (
              <div className="flex-1">
                <BlockCreate type="main" siteId={site.id} />
              </div>
            )}

            <Button onClick={() => setPreview(state => !state)}>
              {preview === false ? <Eye /> : <Pencil />}
            </Button>
          </div>
        </Main>

        {/* <Footer>
          <div className="flex gap-3 items-center justify-center">
            <BlockList blocks={data.social} site={site} type="social" />
            <BlockCreate type="social" siteId={site.id} />
          </div>
        </Footer> */}
      </Content>

      {preview === false && (
        <div className="absolute left-0 right-0 flex items-center justify-center p-4 pointer-events-none">
          <UpdateSiteBackgroundButton>
            <UpdateSiteBackgroundModal
              siteId={site.id}
              background={site.background}
            />
          </UpdateSiteBackgroundButton>
        </div>
      )}
    </Wrapper>
  );
};

export const WebSite = ({
  site
}: {
  site: Prisma.SiteGetPayload<{ include: { blocks: true } }>;
}) => {
  const [preview, setPreview] = useState(false);

  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  if (preview === true) {
    return createPortal(
      <Inner
        preview={preview}
        setPreview={setPreview}
        data={data}
        site={site}
      />,
      document.body
    );
  }

  return (
    <Inner preview={preview} setPreview={setPreview} data={data} site={site} />
  );
};
