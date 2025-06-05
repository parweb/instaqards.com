'use client';

import type { Block, Prisma } from '@prisma/client';

import { BlockForm } from 'components/editor/form/BlockForm';

export default function UpdateBlockModal({
  block
}: {
  block: Prisma.BlockGetPayload<{
    select: {
      id: true;
      type: true;
      label: true;
      href: true;
      logo: true;
      widget: true;
      siteId: true;
    };
  }>;
}) {
  const mode: {
    id: Block['id'];
    mode: 'update';
    type: Block['type'];
    title: string;
  } = {
    id: block.id,
    mode: 'update',
    type: block.type,
    title: 'Update a block'
  };

  return (
    <BlockForm
      {...{
        mode,
        initialData: {
          label: String(block.label),
          href: String(block.href),
          logo: String(block.logo)
        },
        initialWidget: block.widget,
        siteId: block.siteId
      }}
    />
  );
}
