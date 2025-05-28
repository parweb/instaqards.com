'use client';

import { Block, Prisma } from '@prisma/client';
import { Suspense } from 'react';

import { BlockList } from 'app/[domain]/client';
import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';

import 'array-grouping-polyfill';

interface ListProps {
  sites: Prisma.SiteGetPayload<{
    include: {
      user: {
        include: {
          naf: {
            include: {
              class: {
                include: {
                  group: {
                    include: { division: { include: { section: true } } };
                  };
                };
              };
            };
          };
        };
      };
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] };
    };
  }>[];
}

export const List = ({ sites }: ListProps) => {
  return (
    <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 self-stretch p-4">
      {sites.map(site => {
        const data: Record<Block['type'], Block[]> = {
          main: [],
          social: [],

          ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
        };

        return (
          <div
            key={site.id}
            className="group flex flex-1 cursor-pointer flex-col self-stretch rounded-md transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl"
          >
            <div className="bg-muted/60 relative flex aspect-square flex-1 flex-col items-center justify-center self-stretch overflow-hidden rounded-md border">
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
          </div>
        );
      })}
    </div>
  );
};
