'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function PreviewBackgroundComponent({ name }: { name: string }) {
  const file = name?.replace('component:', '');

  const Background = dynamic(
    () =>
      import(`components/editor/backgrounds/${file}`).then(mod => mod[file]),
    { ssr: false }
  );

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        console.error(error), (<div>Something went wrong, sorry!</div>)
      )}
    >
      <Background />
    </ErrorBoundary>
  );
}

export const PreviewBackground = memo(PreviewBackgroundComponent);
