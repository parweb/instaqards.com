'use client';

import { Block, Site } from '@prisma/client';
import { useAtomValue } from 'jotai';
import { Suspense } from 'react';

import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { $site } from './$site';

export const Qards = ({ siteId }: { siteId: Site['id'] }) => {
  const site = useAtomValue(
    $site({
      where: { id: siteId },
      include: { blocks: true }
    })
  );

  const data: Record<Block['type'], Block[]> = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
  };

  return (
    <div className="relative w-full aspect-[2/3] max-w-xl mx-auto flex overflow-hidden rounded-3xl">
      <Wrapper>
        <Suspense fallback={null}>
          <Background background={site.background} />
        </Suspense>

        <Content>
          <Main length={data.main.length}>
            <Suspense fallback={null}>
              <BlockList blocks={data.main} />
            </Suspense>
          </Main>

          <Footer>
            <div className="flex gap-3 items-center justify-center">
              <Suspense fallback={null}>
                <BlockList blocks={data.social} />
              </Suspense>
            </div>
          </Footer>
        </Content>
      </Wrapper>
    </div>
  );
};
