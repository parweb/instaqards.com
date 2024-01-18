import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Posts from '@/components/posts';
import CreatePostButton from '@/components/create-post-button';
import { cn } from '@/lib/utils';

const Landing = () => {
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
          </footer>
        </div>
      </section>
    </main>
  );
};

export default async function SitePosts({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id)
    }
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            All Posts for {data.name}
          </h1>
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${data.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a>
        </div>

        {/*<CreatePostButton />*/}
      </div>

      <div className="flex flex-col h-[100vh]">
        <Landing />
      </div>
    </>
  );
}
