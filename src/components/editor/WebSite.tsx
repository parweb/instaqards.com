import type { Block, Prisma } from '@prisma/client';

import { BlockList } from 'components/BlockItem';
import CreateBlockButton from 'components/create-block-button';
import CreateBlockModal from 'components/modal/create-block';
import UpdateSiteBackgroundModal from 'components/modal/update-site-background';
import UpdateSiteBackgroundButton from 'components/update-site-background-button';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Wrapper } from 'components/website/wrapper';

import 'array-grouping-polyfill';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';

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
  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  return (
    <Wrapper>
      <Background background={site.background} />

      <Content>
        <Main>
          <BlockList blocks={data.main} site={site} type="main" />

          <BlockCreate type="main" />
        </Main>

        <Footer>
          <div className="flex gap-3 items-center justify-center">
            <BlockList blocks={data.social} site={site} type="social" />
            <BlockCreate type="social" />
          </div>
        </Footer>
      </Content>

      <div className="absolute left-0 right-0 flex items-center justify-center p-4">
        <UpdateSiteBackgroundButton>
          <UpdateSiteBackgroundModal siteId={site.id} />
        </UpdateSiteBackgroundButton>
      </div>
    </Wrapper>
  );
};
