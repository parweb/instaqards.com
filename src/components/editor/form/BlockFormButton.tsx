'use client';

import { useFormStatus } from 'react-dom';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

export function BlockFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn(
        'w-full',
        pending
          ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
          : 'border-black bg-black text-white hover:bg-white hover:text-black'
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save</p>}
    </Button>
  );
}
