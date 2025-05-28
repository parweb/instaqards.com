import { getLang } from 'helpers/translate';
import Image from 'next/image';
import { Begin } from '../home/section/begin';
import { Personas } from './personas';
import { Suspense } from 'react';
import { WebSite } from 'components/editor/WebSite';
import { db } from 'helpers/db';
import * as job from 'data/job';

export default async function ProPage() {
  const lang = await getLang();
  const site = await db.site.findUnique({
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    where: {
      id: 'cm8dqblta000vspcs6c7giksg'
    }
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 self-stretch p-4">
      <div className="mt-0 -mb-8 flex flex-1 flex-col items-center justify-center">
        <div>
          <Image
            src={`/plateform-number-one-commercants-artisants-${lang}.png`}
            alt="Plateform number one commercants artisants"
            width={500}
            height={100}
          />
        </div>
      </div>

      <div className="w-full">
        <Personas
          jobs={job.all.map(job => ({
            ...job,
            profession: job.profession[lang]
          }))}
        />
      </div>

      <div className="w-full">
        <div className="relative mx-auto flex aspect-[9/16] w-full max-w-xl">
          <Suspense fallback={null}>{site && <WebSite site={site} />}</Suspense>
        </div>
      </div>

      <div>
        <Begin />
      </div>
    </div>
  );
}
