'use client';

import { useFormStatus } from 'react-dom';

import LoadingDots from 'components/icons/loading-dots';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';

export function BlockFormButton({ isLoading }: { isLoading: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={isLoading || pending}>
      {isLoading || pending ? <LoadingDots color="#808080" /> : <p>Save</p>}
    </Button>
  );
}
