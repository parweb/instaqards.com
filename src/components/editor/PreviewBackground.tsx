'use client';

import dynamic from 'next/dynamic';

export function PreviewBackground({ name }: { name: string }) {
  const file = name?.replace('component:', '');

  const Background = dynamic(() =>
    import(`components/editor/backgrounds/${file}`).then(mod => mod[file])
  );

  return <Background />;
}
