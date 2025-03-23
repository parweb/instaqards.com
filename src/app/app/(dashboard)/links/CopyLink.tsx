'use client';

import { useState } from 'react';
import { LuCheck, LuClipboard } from 'react-icons/lu';

import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

export const CopyLink = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      className={cn(
        'hover:text-blue-500 hover:font-bold cursor-pointer',
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
