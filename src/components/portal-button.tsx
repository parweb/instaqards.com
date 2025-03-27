'use client';

import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';

import { postData } from 'helpers/api';
import { cn } from 'lib/utils';

export const PortalButton = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onClick = async () => {
    try {
      setLoading(true);

      const { url } = await postData({
        url: '/api/create-portal-link'
      });

      router.push(url);
    } catch (error) {
      setLoading(false);
      alert((error as Error)?.message);
    } finally {
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className={cn(
          'flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-hidden sm:h-10 border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800'
        )}
      >
        {loading ? <LuLoader className="animate-spin" /> : children}
      </button>
    </div>
  );
};
