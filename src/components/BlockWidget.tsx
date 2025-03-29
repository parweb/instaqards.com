'use client';

import type { Block } from '@prisma/client';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const BlockWidgetComponent = ({ block }: { block: Block }) => {
  const widget = block.widget as unknown as {
    type: string;
    id: string;
    data: unknown;
  };

  console.log({ widget });

  const Component = dynamic(
    () => import(`components/editor/blocks/${widget.type}/${widget.id}.tsx`),
    { ssr: false }
  );

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        console.error(error), (<div>Something went wrong, sorry!</div>)
      )}
    >
      {/* @ts-ignore */}
      <Component {...(widget?.data ?? {})} block={block} />
    </ErrorBoundary>
  );
};

export default memo(BlockWidgetComponent);
