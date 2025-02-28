import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getSiteData } from 'lib/fetchers';

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const param = await params;
  console.log({ param });

  const domain = decodeURIComponent(param.domain);
  const data = await getSiteData(domain);

  if (!data) {
    return {};
  }

  const {
    name: title,
    description,
    image,
    logo
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@qards_link'
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`)
  };
}

export default async function SiteLayout({
  params,
  children
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === 'true'
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return <>{children}</>;
}
