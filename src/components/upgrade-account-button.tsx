'use client';

import type { ReactNode } from 'react';
import { PiMagicWand } from 'react-icons/pi';

import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import useTranslation from 'hooks/use-translation';

export default function UpgradeAccountButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  return (
    <Button
      type="button"
      onClick={() => modal?.show(children)}
      size="sm"
      className="flex gap-2 items-center justify-center"
    >
      <PiMagicWand />
      <div>{translate('components.account.upgrade')}</div>
    </Button>
  );
}
