import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { LuArrowUpRight, LuCog, LuMousePointer } from 'react-icons/lu';

import DeleteButton from './DeleteButton';

export default function SiteCard({
  data
}: {
  data: Prisma.SiteGetPayload<{ include: { clicks: true } }>;
}) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <div className="group relative rounded-lg border pb-10 shadow-md transition-all hover:shadow-xl border-stone-300 ">
      {/* <div className="absolute inset-0 group pointer-events-auto">
        {data.background && (
          <>
            {media_type?.startsWith('video/') && (
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                preload="auto"
                muted
              >
                <source src={data.background} type="video/mp4" />
              </video>
            )}

            {media_type?.startsWith('image/') && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={data.background}
                alt=""
              />
            )}

            {media_type === 'css' && (
              <PreviewBackground name={data.background} />
            )}
          </>
        )}

        <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      </div> */}

      <div className="flex flex-col overflow-hidden rounded-lg">
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <Link className="flex-1" href={`/site/${data.id}`}>
              <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide">
                {data.name}
              </h3>
            </Link>

            <div className="transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2">
              <Link href={`/site/${data.id}/settings`} className="">
                <LuCog />
              </Link>

              <DeleteButton siteId={data.id} />
            </div>
          </div>

          <Link href={`/site/${data.id}`}>
            <p className="mt-2 line-clamp-1 text-sm font-light leading-snug text-black/80">
              {data.description}
            </p>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:11000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 flex items-center gap-2"
        >
          {url}
          <LuArrowUpRight />
        </a>

        <Link
          href={`/site/${data.id}/analytics`}
          className="flex items-center gap-2 rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400 dark:hover:bg-green-800 dark:hover:bg-opacity-50"
        >
          <p>{data.clicks.length}</p>
          <LuMousePointer />
        </Link>
      </div>
    </div>
  );
}
