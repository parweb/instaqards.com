import { Block } from '@prisma/client';

import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';

import 'array-grouping-polyfill';
import { BlockList } from 'app/[domain]/client';

export default async function Qards() {
  const sites = await db.site.findMany({
    include: {
      user: true,
      clicks: true,
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    take: 2,
    orderBy: { clicks: { _count: 'desc' } }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 p-8">
      {sites.map(async site => {
        const data: Record<Block['type'], Block[]> = {
          main: [],
          social: [],

          ...site.blocks.groupBy(({ type }: { type: Block['type'] }) => type)
        };

        return (
          <div className="relative w-full aspect-[9/16] flex">
            <Wrapper key={site.id}>
              <Background background={site.background} />

              <Content>
                <Main>
                  <BlockList blocks={data.main} />
                </Main>

                <Footer>
                  <div className="flex gap-3 items-center justify-center">
                    <BlockList blocks={data.social} />
                  </div>

                  <div className="text-center">
                    <a
                      href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/?r=${site.user?.id}`}
                      className="text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {await translate('page.public.site.ads')}
                    </a>
                  </div>
                </Footer>
              </Content>
            </Wrapper>
          </div>
        );
      })}
    </div>
  );
}
