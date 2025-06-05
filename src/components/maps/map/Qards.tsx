'use client';

import { Block, Prisma, Site } from '@prisma/client';
import { useAtomValue } from 'jotai';
import { Suspense } from 'react';

import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { $ } from 'helpers/$';

export const Qards = ({ siteId }: { siteId: Site['id'] }) => {
  const site = useAtomValue(
    $.site.findUniqueOrThrow({
      where: { id: siteId },
      select: {
        background: true,
        blocks: {
          select: {
            id: true,
            type: true,
            label: true,
            href: true,
            logo: true,
            style: true,
            widget: true
          }
        }
      }
    })
  );

  const data: Record<
    Block['type'],
    Prisma.BlockGetPayload<{
      select: {
        id: true;
        type: true;
        label: true;
        href: true;
        logo: true;
        style: true;
        widget: true;
      };
    }>[]
  > = {
    main: [],
    social: [],

    ...site.blocks.groupBy(({ type }) => type)
  };

  return (
    <div className="relative mx-auto flex aspect-[2/3] w-full max-w-xl overflow-hidden rounded-3xl">
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
            <div className="flex items-center justify-center gap-3">
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
