import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';

import { getSiteData } from 'lib/fetchers';

export async function generateMetadata(props: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    return null;
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
    openGraph: {
      title,
      description,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@qards_link'
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    alternates: {
      canonical: '/'
    }
  };
}

export default async function SiteLayout(props: {
  params: Promise<{ domain: string }>;
  children: ReactNode;
}) {
  const params = await props.params;

  const { children } = props;

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

  return <Suspense fallback={null}>{children}</Suspense>;
}
