import { headers } from 'next/headers';

export default async function Sitemap() {
  const headersList = headers();

  const domain =
    headersList
      .get('host')
      ?.replace(
        '.localhost:11000',
        `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      ) ?? 'qards.link';

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date()
    }
  ];
}
