import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlurImage from '@/components/blur-image';
import { cn, placeholderBlurhash, toDateString } from '@/lib/utils';
import BlogCard from '@/components/blog-card';
import { getPostsForSite, getSiteData } from '@/lib/fetchers';
import Image from 'next/image';

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true
    },
    // feel free to remove this filter if you want to generate paths for all sites
    where: {
      subdomain: 'demo'
    }
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      },
      customDomain && {
        domain: customDomain
      }
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  // const [data, posts] = await Promise.all([
  //   getSiteData(domain),
  //   getPostsForSite(domain),
  // ]);

  const data = {
    links: [
      {
        label: 'Bookings',
        href: 'mailto:bookings@gellyx.fr?subject=Demande de Bookings'
      },
      {
        label: 'Soundcloud',
        href: 'https://soundcloud.com/gellyx-173797483?ref=clipboard&p=i&c=1&si=AB159F783EDE4006AABCA86243513D4D&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
      },
      { label: 'TikTok', href: 'https://www.tiktok.com/@dj.gellyx' },
      { label: 'Youtube', href: 'https://www.youtube.com/@Gellyx-ek4wm' }
    ],
    socials: [
      {
        site: 'facebook',
        logo: 'https://gellyx.fr/logo_facebook.png',
        href: 'https://www.facebook.com/gauthier.gelly'
      },
      {
        site: 'instagram',
        logo: 'https://gellyx.fr/logo_insta.png',
        href: 'https://www.instagram.com/gellyx_/'
      }
    ]
  };

  if (!data) {
    notFound();
  }

  return (
    <main className="relative flex-1 self-stretch items-center">
      <div className="absolute inset-0">
        <video
          className="absolute top-0 right-0 object-cover min-h-full min-w-full h-[100vh]"
          preload="auto"
          autoplay="true"
          loop="true"
          muted="true"
          playsinline="true"
        >
          <source src="https://gellyx.fr/video/2.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0  bg-black/30" />
      </div>

      <section className="absolute inset-0 flex flex-col p-10">
        <div className="relative flex flex-col items-center m-auto w-[80%] max-w-[600px] gap-3 justify-between flex-1">
          <div className="flex flex-1 self-stretch items-center justify-center">
            <div className="flex flex-col gap-10 flex-1">
              {data.links.map(({ href, label }) => (
                <a
                  key={`LinkItem-${href}`}
                  href={href}
                  className={cn(
                    'transition-all',
                    'border border-white/90 rounded-md p-3 text-white/90 w-full text-center',
                    'hover:bg-white hover:text-black'
                  )}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <footer className="flex flex-col gap-3">
            <div className="flex gap-3 items-center justify-center">
              {data.socials.map(({ site, href, logo }) => (
                <a key={`SocialItem-${href}`} href={href} target="_blank">
                  <img
                    className={cn(
                      site === 'facebook' && 'h-[65px]',
                      site === 'instagram' && 'h-[50px]',
                      'object-contain'
                    )}
                    src={logo}
                    alt={site}
                  />
                </a>
              ))}
            </div>

            <div className="text-center">
              <a
                href="https://www.igfilms.fr/"
                className="text-white"
                target="_blank"
              >
                powered by NotoriousMe
              </a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
