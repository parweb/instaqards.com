'use client';

import type { Block, Site } from '@prisma/client';

import { BlockForm } from 'components/editor/form/BlockForm';

export default function CreateBlockModal({
  type,
  siteId
}: {
  type: Block['type'];
  siteId: Site['id'];
}) {
  const mode: { id: null; mode: 'create'; type: Block['type']; title: string } =
    {
      id: null,
      mode: 'create',
      type,
      title: 'Create a block'
    };

  return (
    <BlockForm
      {...{
        mode,
        initialData: {
          label: '',
          href: '',
          logo: ''
        },
        initialWidget: null,
        siteId
      }}
    />
  );
}
