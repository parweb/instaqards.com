'use client';

import type { Link, Site } from '@prisma/client';
import va from '@vercel/analytics';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { SocialIcon, getKeys } from 'react-social-icons';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { Input } from 'components/ui/input';
import { updateLink } from 'lib/actions';
import { cn } from 'lib/utils';
import { useModal } from './provider';

export default function UpdateLinkModal(link: Link) {
  const router = useRouter();
  const params = useParams();
  const modal = useModal();

  const [data, setData] = useState(link);
  const [filter, setFilter] = useState<string | null>(null);
  const [logo, setLogo] = useState<string>('');

  const socials =
    filter === null
      ? getKeys()
      : getKeys().filter(key => key.includes(filter ?? ''));

  return (
    <form
      action={async (data: FormData) =>
        updateLink(data, params.id as Site['id'], link.id).then(res => {
          if ('error' in res) {
            toast.error(res.error);
          } else {
            va.track('Update link', { id: link.id });

            router.refresh();
            modal?.hide();
            toast.success('Link updated!');
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Update the link</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="label"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Label
          </label>

          <input
            id="label"
            name="label"
            type="text"
            placeholder="Label"
            value={data.label}
            onChange={e => setData({ ...data, label: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="href"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Link
          </label>

          <div className="flex items-center gap-2">
            {link.type === 'social' && (
              <div>
                <SocialIcon
                  href={data.href}
                  network={logo}
                  fallback={{ color: '#000000', path: 'M0' }}
                  style={{ width: 28, height: 28 }}
                />
              </div>
            )}

            <input
              id="href"
              name="href"
              type="text"
              placeholder="https://instagram.com/..."
              value={data.href}
              onChange={e => setData({ ...data, href: e.target.value })}
              required
              className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
            />
          </div>
        </div>

        {link.type === 'social' && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="logo"
              className="text-sm font-medium text-stone-500 dark:text-stone-400"
            >
              Logo
            </label>

            <Input
              id="filter"
              name="filter"
              type="text"
              placeholder="facebook, twitter, ..."
              value={filter ?? ''}
              onChange={e => setFilter(e.target.value)}
            />

            <div className="grid grid-cols-8 gap-2">
              {socials.map(key => (
                <SocialIcon
                  title={key}
                  key={key}
                  network={key}
                  style={{
                    width: 34,
                    height: 34,
                    boxShadow: `0 0 0 2px ${logo === key ? 'black' : 'white'}`
                  }}
                  className={cn(
                    'rounded-full transition-all duration-300 border-2 border-white'
                  )}
                  onClick={() => setLogo(logo === key ? '' : key)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <UpdateLinkFormButton />
      </div>
    </form>
  );
}

function UpdateLinkFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(
        'flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          : 'border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800'
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save</p>}
    </button>
  );
}
