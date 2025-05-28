'use client';

import type { User } from '@prisma/client';
import va from '@vercel/analytics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuCheck, LuClipboard, LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import useTranslation from 'hooks/use-translation';
import { createMagicLink } from 'lib/actions';
import { cn } from 'lib/utils';
import { useFormStatus } from 'react-dom';

export default function UserMagicLinkModal({
  user
}: {
  user: Pick<User, 'id' | 'email'>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const translate = useTranslation();

  const [data, setData] = useState<{ link: string }>({
    link: ''
  });

  const copyLink = useCallback(() => {
    if (!data.link) return;

    input.current?.select();
    input.current?.setSelectionRange(0, 0);
    navigator.clipboard.writeText(data.link);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [data.link]);

  useEffect(() => {
    if (loading === false || started.current === true) return;

    started.current = true;

    createMagicLink({
      email: user.email
    }).then(res => {
      if ('error' in res) {
        toast.error(res.error);
        console.error(res.error);
      } else {
        setData({ ...data, link: res.url });
        toast.success('Magic link created!');
        va.track('Magic link created', { id: user.id, email: user.email });

        setTimeout(() => {
          copyLink();
        }, 200);
      }

      setLoading(false);
    });
  }, [loading]);

  return (
    <form className="w-full rounded-md bg-white md:max-w-md md:border md:border-stone-200 md:shadow-sm dark:bg-stone-800 dark:md:border-stone-700">
      <div className="relative flex flex-col gap-4 p-4">
        <h2 className="font-cal text-2xl dark:text-white">
          {translate('components.user.magiclink.title')}
        </h2>

        <div className="relative flex items-center gap-1">
          <Input
            ref={input}
            id="link"
            name="link"
            placeholder="Link"
            value={data.link}
            onChange={e => setData({ ...data, link: data.link })}
            onClick={copyLink}
          />

          {data.link && (
            <Button
              className={cn(
                'cursor-pointer hover:font-bold hover:text-blue-500',
                isCopied && 'text-green-500'
              )}
              type="button"
              variant="ghost"
              size="icon"
              onClick={copyLink}
            >
              {isCopied ? <LuCheck /> : <LuClipboard />}
            </Button>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LuLoader className="animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 md:px-10 dark:border-stone-700 dark:bg-stone-800">
        <UserMagicLinkButton />
      </div>
    </form>
  );
}

function UserMagicLinkButton() {
  const translate = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>{translate('components.user.magiclink.button')}</p>
      )}
    </Button>
  );
}
