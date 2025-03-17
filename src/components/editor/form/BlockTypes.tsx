'use client';

import { BlockTypesItem } from './BlockTypesItem';

export const BlockTypes = ({
  onClick
}: {
  onClick: (data: { type: string; id: string }) => void;
}) => {
  return (
    <div className="flex flex-col gap-4" style={{ touchAction: 'pan-y' }}>
      {(
        [
          { type: 'button', label: 'Boutons' },
          { type: 'picture', label: 'Images' },
          { type: 'text', label: 'Textes' },
          { type: 'external', label: 'Externes' }
        ] as const
      ).map(block => (
        <BlockTypesItem key={block.type} {...block} onClick={onClick} />
      ))}
    </div>
  );
};
