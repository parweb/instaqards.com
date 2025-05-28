import { nanoid } from 'nanoid';
import Image from 'next/image';
import { Suspense } from 'react';
import * as z from 'zod';

import { Begin } from 'app/(marketing)/home/section/begin';
import { WebSite } from 'components/editor/WebSite';
import * as job from 'data/job';
import { Job } from 'data/job';
import { db } from 'helpers/db';
import { getLang, translate } from 'helpers/translate';
import { getAuth } from 'lib/auth';
import { Personas } from './personas';

const ParamsSchema = z.object({
  select: z
    .string()
    .optional()
    .default(job.all[0].id)
    .transform(v => v as Job['id'])
});

export default async function ProPage({
  searchParams
}: {
  searchParams: Promise<z.infer<typeof ParamsSchema>>;
}) {
  const params = ParamsSchema.parse(await searchParams);

  const auth = await getAuth();

  const lang = await getLang();
  const template = await db.site.findUnique({
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    where: {
      subdomain: params.select,
      user: {
        email: 'templates@qards.link'
      }
    }
  });

  if (!template) {
    return { error: await translate('error') };
  }

  let slug = nanoid(5);
  let newSubdomain = `${template.subdomain}-${slug}`;

  const newName = template.name;
  const newDisplayName = template.display_name;

  while (true) {
    newSubdomain = `${template.subdomain}-${slug}`;

    const taken = await db.site.findUnique({
      where: { subdomain: newSubdomain }
    });

    if (!taken) break;

    slug = nanoid(5);
  }

  const already = await db.site.findFirst({
    where: {
      subdomain: { startsWith: `${template.subdomain}-` },
      user: { id: auth.id }
    }
  });

  let siteId = null;

  if (already === null) {
    const newSite = await db.site.create({
      data: {
        name: newName,
        display_name: newDisplayName,
        description: template.description,
        logo: template.logo,
        font: template.font,
        image: template.image,
        imageBlurhash: template.imageBlurhash,
        subdomain: newSubdomain,
        customDomain: null,
        message404: template.message404,
        background: template.background,
        user: { connect: { id: auth.id } }
      }
    });

    siteId = newSite.id;

    if (template.blocks.length > 0) {
      await db.block.createMany({
        data: template.blocks.map(block => ({
          type: block.type,
          position: block.position,
          label: block.label,
          href: block.href,
          logo: block.logo,
          style: block.style ?? {},
          widget: block.widget ?? {},
          siteId: newSite.id
        }))
      });
    }
  } else {
    siteId = already.id;
  }

  const site = await db.site.findUnique({
    include: {
      blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
    },
    where: {
      id: siteId
    }
  });

  return (
    <div className="flex-1 self-stretch flex flex-col items-center justify-center p-4 gap-12">
      <div className="flex-1 flex flex-col items-center justify-center -mb-8 mt-0">
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
            id: job.id,
            profession: job.profession[lang]
          }))}
        />
      </div>

      <div className="w-full">
        <div className="relative w-full aspect-[9/16] max-w-xl mx-auto flex">
          <Suspense fallback={null}>{site && <WebSite site={site} />}</Suspense>
        </div>
      </div>

      <div>
        <Begin />
      </div>
    </div>
  );
}
