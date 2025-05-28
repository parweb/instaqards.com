'use client';

import { Suspense } from 'react';
import { LuLoader } from 'react-icons/lu';

import { Qards } from './Qards';

export const CustomPopupContentQards = ({
  marker
}: {
  marker: { id: string; position: [number, number]; name?: string };
}) => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="relative top-[11px] left-[1px] rounded-full bg-white/10 p-4 shadow-lg backdrop-blur-md">
              <LuLoader className="animate-spin" />
            </div>
          </div>
        }
      >
        <Qards siteId={marker.id} />
      </Suspense>
    </div>
  );
};
