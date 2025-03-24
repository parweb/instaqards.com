import type { Block } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Background } from 'components/website/background';
import { Content } from 'components/website/content';
import { Footer } from 'components/website/footer';
import { Main } from 'components/website/main';
import { Wrapper } from 'components/website/wrapper';
import { db } from 'helpers/db';
import { translate } from 'helpers/translate';
import { getSubscription } from 'lib/auth';
import { getSiteData } from 'lib/fetchers';
import { BlockList } from './client';

import 'array-grouping-polyfill';

export default async function SiteHomePage({
  params
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const site = await getSiteData(domain);

  if (!site) {
    notFound();
  }

  const subscription = await getSubscription({ site });

  if (!subscription.valid()) {
    return (
      <div className="flex items-center justify-center flex-1 self-stretch">
        <div className="max-w-md m-2 p-6 border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800">
            {translate('page.public.site.title')}
          </h2>

          <p className="text-gray-600 ">
            {translate('page.public.site.description')}
          </p>

          <div>
            <Link
              className="bg-black rounded-md px-3 py-2 text-white"
              href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
            >
              {translate('page.public.site.create')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await db.click.create({ data: { siteId: site.id } });

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
              {translate('page.public.site.ads')}
            </a>
          </div>
        </Footer>
      </Content>
    </Wrapper>
  );
}
