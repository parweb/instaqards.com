'use client';

import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

import {
  LuArrowUpRight,
  LuCheck,
  LuClipboard,
  LuMousePointer
} from 'react-icons/lu';

import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';
import DeleteButton from './DeleteButton';
import { EditButton } from './EditButton';
import { MutateModal } from './MutateModal';
import { uri } from 'settings';

const CopyLink = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      className={cn(
        'cursor-pointer hover:font-bold hover:text-blue-500',
        isCopied && 'text-green-500'
      )}
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => {
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }}
    >
      {isCopied ? <LuCheck /> : <LuClipboard />}
    </Button>
  );
};

type LinkCardProps = {
  link: Prisma.LinkGetPayload<{ include: { clicks: true } }>;
};

export function LinkCard({ link }: LinkCardProps) {
  const url = uri.app(`/${link.id}`).replace('app.', 'short.');

  return (
    <div className="group relative rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl">
      <div className="flex flex-col overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-t border-stone-200 p-4">
          <div>
            <div className="flex items-center justify-start gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="truncate text-xs font-medium whitespace-nowrap text-stone-500">
                {link.url}
              </p>
            </div>

            <div className="flex items-center justify-between gap-1">
              <Link prefetch className="flex-1" href={`/site/${link.id}`}>
                <h3 className="font-cal truncate text-xl font-bold tracking-wide">
                  {link.name}
                </h3>
              </Link>

              <div className="flex items-center gap-0 opacity-0 transition-all group-hover:opacity-100">
                <EditButton>
                  <MutateModal link={link} />
                </EditButton>

                <DeleteButton linkId={link.id} />
              </div>
            </div>

            <Link prefetch href={`/site/${link.id}`}>
              <p className="line-clamp-1 text-sm leading-snug font-normal text-stone-500 dark:text-stone-400">
                {link.description}
              </p>
            </Link>
          </div>

          <div className="flex justify-between">
            <div
              className={cn(
                'flex items-center gap-2 pl-2',
                'rounded-md bg-stone-100 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200'
              )}
            >
              <Link
                prefetch
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1"
              >
                <span className="max-w-20 truncate">{`/${link.id}`}</span>
                <LuArrowUpRight />
              </Link>

              <CopyLink url={url} />
            </div>

            <Link
              prefetch
              href={`/site/${link.id}/analytics`}
              className="dark:bg-opacity-50 dark:hover:bg-opacity-50 flex items-center gap-2 rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
            >
              <p>{link.clicks.length}</p>
              <LuMousePointer />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
