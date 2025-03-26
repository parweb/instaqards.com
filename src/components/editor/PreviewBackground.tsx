'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

export function PreviewBackground({ name }: { name: string }) {
  const file = name?.replace('component:', '');

  const Background = dynamic(() =>
    import(`components/editor/backgrounds/${file}`).then(mod => mod[file])
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
