'use client';

import type { ReactNode } from 'react';

import { useModal } from 'components/modal/provider';
import useTranslation from 'hooks/use-translation';
import { Button } from 'components/ui/button';

export default function CreateSiteButton({
  children
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  const translate = useTranslation();

  return (
    <Button type="button" onClick={() => modal?.show(children)}>
      {translate('components.site.create.button')}
    </Button>
  );
}
