'use server';

import { nanoid } from 'nanoid';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from 'helpers/db';
import { getSession } from 'lib/auth';

export const generateSite = async (form: FormData) => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const siteId = form.get('siteId') as string;

  const site = siteId
    ? await db.site.findUnique({
        where: { id: siteId },
        include: {
          blocks: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }
        }
      })
    : null;

  const data = Object.fromEntries(form);

  const name = data.name as string;
  const description = data.description as string;

  const button = data.button ? JSON.parse(String(data.button)) : null;

  const subdomain = String(data.name)
    .toLowerCase()
    .trim()
    .replace(/[\W_]+/g, '-');

  const links = (data.links as string)
    .split('\n')
    .filter(Boolean)
    .map(link => link.trim());

  console.info('db.site.upsert', {
    where: { id: site?.id || nanoid() },
    update: {
      name,
      description,
      subdomain
    },
    create: {
      name,
      description,
      subdomain,
      user: { connect: { id: session.user.id } }
    }
  });

  const qards = await db.site.upsert({
    where: { id: site?.id || nanoid() },
    update: {
      name,
      description,
      subdomain
    },
    create: {
      name,
      description,
      subdomain,
      user: { connect: { id: session.user.id } }
    }
  });

  if (links.length) {
    console.info({ links: links.entries() });

    await db.block.deleteMany({
      where: { siteId: qards.id }
    });

    for (const [index, link] of links.entries()) {
      let label: string | undefined;
      let href: string | undefined;

      const line = link.split('|').map(item => item.trim());

      if (line.length === 1) {
        const link = String(line.at(0)?.replace(/\/$/, ''));

        href = link.includes(':') ? link : `https://${link}`;
        label =
          new URL(href).hostname.split('.').at(-2) ?? href.split(':').at(0);
      }

      if (line.length === 2) {
        const link = String(line.at(1)?.replace(/\/$/, ''));

        label = line.at(0);
        href = link.includes(':') ? link : `https://${link}`;
      }

      await db.block.create({
        data: {
          siteId: qards.id,
          type: 'main',
          position: index,
          label,
          href,

          ...(Object.keys(button || {}).length && {
            widget: {
              ...button,
              data: { label, href }
            }
          })

          // widget: {
          //   create: {
          //     data: { href: link, label }
          //   }
          // }
        }
      });
    }
  }

  revalidateTag(
    `${site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
  );
  site?.customDomain && revalidateTag(`${site?.customDomain}-metadata`);

  console.info({ site });

  if (site === null) redirect(`?siteId=${qards.id}`);

  return db.site.findUnique({
    where: { id: qards.id },
    include: { blocks: true }
  });
};
