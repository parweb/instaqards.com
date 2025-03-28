'use client';

import type { Block } from '@prisma/client';
import dynamic from 'next/dynamic';
import { memo } from 'react';

export const BlockWidget = memo(({ block }: { block: Block }) => {
  const widget = block.widget as unknown as {
    type: string;
    id: string;
    data: unknown;
  };

  const Component = dynamic(
    () => import(`components/editor/blocks/${widget.type}/${widget.id}.tsx`),
    { ssr: false }
  );

  // @ts-ignore
  return <Component {...(widget?.data ?? {})} block={block} />;
});

BlockWidget.displayName = 'BlockWidget';
