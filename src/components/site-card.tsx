'use client';

import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { LuArrowUpRight, LuCog, LuCopy, LuMousePointer } from 'react-icons/lu';
import { motion } from 'motion/react';

import { uri } from 'settings';
import DeleteButton from './DeleteButton';
import ModalButton from './modal-button';
import SiteDuplicateModal from './modal/duplicate-site';

export default function SiteCard({
  data
}: {
  data: Prisma.SiteGetPayload<{ include: { clicks: true } }>;
}) {
  return (
    <div className="group relative rounded-lg border border-stone-300 bg-white/80 pb-10 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-[1.025] hover:border-blue-400/70 hover:shadow-2xl dark:bg-zinc-900/80 dark:hover:border-blue-500/60">
      <div className="flex flex-col overflow-hidden rounded-lg">
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <Link prefetch className="flex-1" href={`/site/${data.id}`}>
              <h3 className="font-cal my-0 truncate text-xl font-bold tracking-wide">
                {data.name}
              </h3>
            </Link>

            <motion.div
              initial={{ x: 24, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex items-center gap-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            >
              <ModalButton variant="ghost" size="icon" label={<LuCopy />}>
                <SiteDuplicateModal site={data} />
              </ModalButton>

              <Link prefetch href={`/site/${data.id}/settings`} className="">
                <LuCog />
              </Link>

              <DeleteButton siteId={data.id} />
            </motion.div>
          </div>

          <Link prefetch href={`/site/${data.id}`}>
            <p className="mt-2 line-clamp-1 text-sm leading-snug font-light text-black/80">
              {data.description}
            </p>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={uri.site(data).link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {uri.site(data).title}
          <LuArrowUpRight />
        </a>

        <Link
          prefetch
          href={`/site/${data.id}/analytics`}
          className="dark:bg-opacity-50 dark:hover:bg-opacity-50 flex items-center gap-2 rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
        >
          <p>{data.clicks.length}</p>
          <LuMousePointer />
        </Link>
      </div>
    </div>
  );
}
