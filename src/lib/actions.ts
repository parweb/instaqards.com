'use server';

import { customAlphabet } from 'nanoid';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { z } from 'zod';

import {
  type User,
  UserRole,
  type Block,
  type Link,
  type Site
} from '@prisma/client';

import { db } from 'helpers/db';
import { sendOutboxEmail } from 'helpers/mail';
import { put } from 'helpers/storage';
import { translate } from 'helpers/translate';
import { trySafe } from 'helpers/trySafe';
import { shorten } from 'helpers/url';
import { getSession, withSiteAuth } from 'lib/auth';
import { getBlurDataURL } from 'lib/utils';

import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex
} from 'lib/domains';
import { createHash } from 'helpers/createHash';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
);

export const createSite = async (
  form: FormData
): Promise<{ error: string } | Site> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  const userId = form.has('user') ? String(form.get('user')) : session.user.id;
  const name = String(form.get('name'));
  const description = String(form.get('description'));
  const subdomain = String(form.get('subdomain'))
    .toLowerCase()
    .trim()
    .replace(/[\W_]+/g, '-');

  try {
    const response = await db.site.create({
      data: {
        name,
        description,
        subdomain,
        user: { connect: { id: userId } },
        blocks: {
          create: {
            type: 'main',
            position: 0,
            widget: {
              id: 'profile',
              type: 'other',
              data: {
                name: name,
                description: description,
                images: [
                  {
                    id: '1',
                    kind: 'remote',
                    url: 'https://qards.link/rsz_noir-fon-transparent.png'
                  }
                ]
              }
            }
          }
        }
      }
    });

    after(() => {
      db.event
        .create({
          data: {
            userId: String(session.user.id),
            eventType: 'SITE_CREATED',
            payload: response,
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::createSite', event);
        })
        .catch(error => {
          console.error('events::createSite', error);
        });
    });

    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error && 'code' in error && error.code === 'P2002'
          ? await translate('lib.actions.domain.taken')
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred'
    };
  }
};

const input = z.object({
  id: z.string().optional(),
  url: z.string().min(1, 'url is required'),
  name: z.string().optional(),
  description: z.string().optional()
});

export const mutateLink = async (
  form: FormData
): Promise<{ error: string } | Link> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  const { url, name, description, id } = input.parse(Object.fromEntries(form));

  console.info({ url, name, description, id });

  const href = url.includes(':') ? url : `https://${url}`;
  const label =
    new URL(href).hostname.split('.').at(-2) ?? href.split(':').at(0);

  console.info({
    label,
    href,
    hostname: new URL(href).hostname,
    hostname_splited: new URL(href).hostname.split('.')
  });

  try {
    const response = await db.link.upsert({
      where: { id: id || shorten(session.user.id + href) },
      update: {
        name: name,
        description,
        url: href,
        user: { connect: { id: session.user.id } }
      },
      create: {
        id: shorten(session.user.id + href),
        name: name || label,
        description,
        url: href,
        user: { connect: { id: session.user.id } }
      }
    });

    after(() => {
      db.event
        .create({
          data: {
            userId: String(session.user.id),
            eventType: 'LINK_MUTATED',
            payload: response,
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::mutateLink', event);
        })
        .catch(error => {
          console.error('events::mutateLink', error);
        });
    });

    return response;
  } catch (error: unknown) {
    console.error(error);

    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

type Input = [string, number, string, string | File] | [string, string];
type Output = Record<string, string | Record<string, string | File>[]>;

const transformArrayToObject = (list: Input[]): Output =>
  list.reduce((carry, entry) => {
    if (entry.length === 2) {
      const [key, value] = entry;
      carry[key] = value;
    } else {
      const [key, index, attr, value] = entry;
      if (!Array.isArray(carry[key])) carry[key] = [];

      (carry[key] as Record<string, string | File>[])[index] = {
        ...((carry[key] as Record<string, string | File>[])[index] || {}),
        [attr]: value
      };
    }

    return carry;
  }, {} as Output);

const hasFile = (value: unknown): boolean => {
  if (value instanceof File) return true;

  if (Array.isArray(value)) {
    return value.some(item => hasFile(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(val => hasFile(val));
  }

  return false;
};

const filterEntriesWithFiles = <T extends Record<string, unknown>>(
  entries: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(entries).filter(([, value]) => hasFile(value))
  ) as Partial<T>;
};

export const updateBlock = withSiteAuth<Block>(async (form, _, blockId) => {
  if (!blockId) {
    return { error: 'Block ID is required' };
  }

  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  if (
    !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
      session.user.role
    )
  ) {
    await db.block.findFirstOrThrow({
      where: { id: blockId, site: { userId: session.user.id } }
    });
  }

  const entries = transformArrayToObject(
    [...form.entries()]
      .map(([key, value]) => [...key.split(/\[|\]/).filter(Boolean), value])
      .map(([key, index, attr, value]) =>
        attr === undefined && value === undefined
          ? [key, index]
          : [key, Number(index), attr, value]
      ) as Input[]
  );

  const uploadables = Object.entries(filterEntriesWithFiles(entries));

  const label = form.get('label') as Block['label'];
  const href = form.get('href') as Block['href'];
  const logo = form.get('logo') as Block['logo'];

  const [, style] = await trySafe<string | undefined>(
    () => JSON.parse(String(form.get('style'))),
    undefined
  );

  const [, widget] = await trySafe<string | undefined>(async () => {
    const parsed = JSON.parse(String(form.get('widget')));

    const medias = Object.fromEntries(
      await Promise.all(
        uploadables.map(async ([key, items]) => [
          key,
          await Promise.all(
            (
              (items || []) as {
                kind: 'local' | 'remote';
                file: File;
                [key: string]: string | File;
              }[]
            ).map(async ({ kind, file, ...media }) => {
              if (kind !== 'local') return { kind, ...media };

              const { url } = await put(
                `${media.id}.${file.type.split('/')[1]}`,
                file
              );

              return {
                ...media,
                kind: 'remote',
                url
              };
            })
          )
        ])
      )
    );

    return { ...parsed, data: { ...parsed.data, ...medias } };
  }, undefined);

  try {
    const response = await db.block.update({
      include: { site: true },
      where: { id: blockId },
      data: {
        label,
        href,
        logo: logo || null,
        ...(widget && { widget }),
        ...(style && { style })
      }
    });

    after(() => {
      db.event
        .create({
          data: {
            userId: String(session.user.id),
            eventType: 'BLOCK_UPDATED',
            payload: response,
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::updateBlock', event);
        })
        .catch(error => {
          console.error('events::updateBlock', error);
        });
    });

    revalidateTag(
      `${response?.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
    response?.site?.customDomain &&
      revalidateTag(`${response?.site?.customDomain}-metadata`);

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
});

export const createBlock = async (
  form: FormData,
  site: Site['id'],
  type: Block['type']
): Promise<{ error: string } | Block> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  if (
    !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
      session.user.role
    )
  ) {
    await db.site.findFirstOrThrow({
      where: { id: site, userId: session.user.id }
    });
  }

  const entries = transformArrayToObject(
    [...form.entries()]
      .map(([key, value]) => [...key.split(/\[|\]/).filter(Boolean), value])
      .map(([key, index, attr, value]) =>
        attr === undefined && value === undefined
          ? [key, index]
          : [key, Number(index), attr, value]
      ) as Input[]
  );

  const uploadables = Object.entries(filterEntriesWithFiles(entries));

  const label = form.get('label') as Block['label'];
  const href = form.get('href') as Block['href'];
  const logo = form.get('logo') as Block['logo'];

  const [, style] = await trySafe<string | undefined>(
    () => JSON.parse(String(form.get('style'))),
    undefined
  );

  const [, widget] = await trySafe<string | undefined>(async () => {
    const parsed = JSON.parse(String(form.get('widget')));

    const medias = Object.fromEntries(
      await Promise.all(
        uploadables.map(async ([key, items]) => [
          key,
          await Promise.all(
            (
              (items || []) as {
                kind: 'local' | 'remote';
                file: File;
                [key: string]: string | File;
              }[]
            ).map(async ({ kind, file, ...media }) => {
              if (kind !== 'local') return { kind, ...media };

              const { url } = await put(
                `${media.id}.${file.type.split('/')[1]}`,
                file
              );

              return {
                ...media,
                kind: 'remote',
                url
              };
            })
          )
        ])
      )
    );

    return { ...parsed, data: { ...parsed.data, ...medias } };
  }, undefined);

  try {
    const response = await db.block.create({
      include: { site: true },
      data: {
        type,
        label,
        href,
        logo: logo || null,
        site: { connect: { id: site } },
        ...(widget && { widget }),
        ...(style && { style })
      }
    });

    revalidateTag(
      `${response?.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
    response?.site?.customDomain &&
      revalidateTag(`${response?.site?.customDomain}-metadata`);

    after(() => {
      db.event
        .create({
          data: {
            userId: String(session.user.id),
            eventType: 'BLOCK_CREATED',
            payload: response,
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::createBlock', event);
        })
        .catch(error => {
          console.error('events::createBlock', error);
        });
    });

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const duplicateBlock = async (blockId: Block['id']) => {
  try {
    const block = await db.block.findUnique({
      include: { site: true },
      where: { id: blockId }
    });

    if (!block) {
      return { error: `Block (${blockId}) not found` };
    }

    const newBlock = await db.block.create({
      data: {
        type: block.type,
        position: block.position,
        label: block.label,
        href: block.href,
        logo: block.logo,
        style: block.style ?? {},
        siteId: block.siteId,
        widget: block.widget ?? {}
      }
    });

    revalidateTag(
      `${block?.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
    block?.site?.customDomain &&
      revalidateTag(`${block?.site?.customDomain}-metadata`);

    return newBlock;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const deleteBlock = async (blockId: Block['id']) => {
  try {
    const response = await db.block.delete({
      include: { site: true },
      where: { id: blockId }
    });

    revalidateTag(
      `${response?.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
    response?.site?.customDomain &&
      revalidateTag(`${response?.site?.customDomain}-metadata`);

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const updateSite = withSiteAuth<Site>(async (formData, site, key) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  if (
    !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
      session.user.role
    )
  ) {
    await db.site.findFirstOrThrow({
      where: { id: site.id, userId: session.user.id }
    });
  }

  if (!key) {
    return { error: await translate('lib.actions.update-site.error') };
  }

  const value = String(formData.get(key));

  try {
    let response: Site = site;

    if (key === 'customDomain') {
      if (value.includes('vercel.pub')) {
        return { error: await translate('lib.actions.vercel.domain.error') };
      }

      if (validDomainRegex.test(value)) {
        response = await db.site.update({
          where: { id: site.id },
          data: {
            customDomain: value.toLowerCase()
          }
        });
        await Promise.all([addDomainToVercel(value)]);
      } else if (value === '') {
        response = await db.site.update({
          where: { id: site.id },
          data: {
            customDomain: null
          }
        });
      }

      if (site.customDomain && site.customDomain !== value) {
        response = await removeDomainFromVercelProject(site.customDomain);
      }
    } else if (['css-background'].includes(key)) {
      response = await db.site.update({
        where: { id: site.id },
        data: {
          background: value
        }
      });

      after(() => {
        db.event
          .create({
            data: {
              userId: String(session.user.id),
              eventType: 'BACKGROUND_UPDATED',
              payload: response,
              correlationId: nanoid()
            }
          })
          .then(event => {
            console.info('events::updateSite', event);
          })
          .catch(error => {
            console.error('events::updateSite', error);
          });
      });
    } else if (['image', 'logo', 'background'].includes(key)) {
      const file = formData.get(key) as File;
      const filename = `${nanoid()}.${file.type.split('/')[1]}`;

      const { url } = await put(filename, file);

      const blurhash = key === 'image' ? await getBlurDataURL(url) : null;

      response = await db.site.update({
        where: { id: site.id },
        data: {
          [key]: url,
          ...(blurhash && { imageBlurhash: blurhash })
        }
      });

      after(() => {
        db.event
          .create({
            data: {
              userId: String(session.user.id),
              eventType: 'BACKGROUND_UPDATED',
              payload: response,
              correlationId: nanoid()
            }
          })
          .then(event => {
            console.info('events::updateSite', event);
          })
          .catch(error => {
            console.error('events::updateSite', error);
          });
      });
    } else {
      response = await db.site.update({
        where: { id: site.id },
        data: {
          [key]: value
        }
      });
    }

    revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );

    site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error && 'code' in error && error.code === 'P2002'
          ? await translate('lib.actions.update-site.error')
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred'
    };
  }
});

export const deleteSite = withSiteAuth<Site>(async (_, site) => {
  try {
    const response = await db.site.delete({
      where: { id: site.id }
    });

    revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );

    response.customDomain && revalidateTag(`${site.customDomain}-metadata`);

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
});

export const deleteLink = async (linkId: Link['id']) => {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { error: await translate('auth.error') };
    }

    const response = await db.link.delete({
      where: {
        id: linkId,
        ...(!([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
          session.user.role
        ) && { userId: session.user.id })
      }
    });

    return response;
  } catch (error: unknown) {
    console.error(error);

    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const patchUser = async (
  formData: FormData,
  _id: unknown,
  key: string
) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  let value = formData.get(key) as string | boolean;

  if (key === 'isTwoFactorEnabled') {
    value = value === 'on';
  }

  try {
    const response = await db.user.update({
      where: { id: session.user.id },
      data: { [key]: value }
    });

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error && 'code' in error && error.code === 'P2002'
          ? await translate('lib.actions.edit-user.error')
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred'
    };
  }
};

export const updateUser = async (form: FormData, userId: User['id']) => {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { error: await translate('auth.error') };
    }

    const old = await db.user.findUnique({
      where: { id: userId }
    });

    if (!old) {
      return { error: await translate('error') };
    }

    const email = String(form.get('email'));
    const name = String(form.get('name'));

    console.info({ email, name, userId });

    const response = await db.user.update({
      where: { id: userId },
      data: { email, name }
    });

    after(() => {
      db.event
        .create({
          data: {
            userId: String(session.user.id),
            eventType: 'USER_UPDATED',
            payload: response,
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::updateUser', event);
        })
        .catch(error => {
          console.error('events::updateUser', error);
        });
    });

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const createUser = async (form: FormData) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  const name = String(form.get('name'));
  const email = String(form.get('email'));

  const response = await db.user.create({
    data: {
      name,
      email,
      role: UserRole.USER,
      referer: { connect: { id: session.user.id } }
    }
  });

  after(() => {
    db.event
      .create({
        data: {
          userId: String(session.user.id),
          eventType: 'USER_CREATED',
          payload: response,
          correlationId: nanoid()
        }
      })
      .then(event => {
        console.info('events::createUser', event);
      })
      .catch(error => {
        console.error('events::createUser', error);
      });
  });

  return response;
};

export const createOutbox = async (form: FormData) => {
  try {
    console.info('createOutbox', form);

    const session = await getSession();

    if (!session?.user?.id) {
      return { error: await translate('auth.error') };
    }

    const userId = String(form.get('user'));
    const subject = String(form.get('subject'));
    const body = String(form.get('body'));

    console.info('createOutbox', { userId, subject, body });

    const user = await db.user.findUnique({
      select: { email: true },
      where: { id: userId }
    });

    if (!user) {
      return { error: await translate('error') };
    }

    await sendOutboxEmail(user.email, subject, body);

    return { success: true };
  } catch (error: unknown) {
    console.error({ error });

    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const duplicateSite = async (
  form: FormData
): Promise<{ error: string } | Site> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  const userId = session.user.id;

  try {
    const siteId = String(form.get('siteId'));
    const name = String(form.get('name'));
    const subdomain = String(form.get('subdomain'));
    const description = String(form.get('description'));

    // 1. Fetch the original site and its blocks
    const originalSite = await db.site.findUnique({
      where: { id: siteId },
      include: {
        blocks: true // Include blocks to duplicate them
      }
    });

    if (!originalSite) {
      return { error: await translate('error') }; // Use generic error key
    }

    // 2. Check user authorization (only owner or admin/seller can duplicate)
    if (
      originalSite.userId !== userId &&
      !([UserRole.ADMIN, UserRole.SELLER] as UserRole[]).includes(
        session.user.role
      )
    ) {
      return { error: await translate('auth.error') }; // Use existing auth error key
    }

    // 3. Prepare data for the new site
    const newName = name || `${originalSite.name || 'Site'} (Copie)`;
    const newDisplayName = `${originalSite.display_name || 'Site'} (Copie)`;

    // Ensure the base subdomain exists before trying to append '-copie'
    const baseSubdomain =
      subdomain || originalSite.subdomain || `site-${nanoid(5)}`; // Generate a base if none exists
    let newSubdomain = `${baseSubdomain}-copie`;
    let suffix = 1;

    // Handle potential subdomain conflicts
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existingSite = await db.site.findUnique({
        where: { subdomain: newSubdomain }
      });

      if (!existingSite) break;

      newSubdomain = `${baseSubdomain}-copie-${suffix++}`;
    }

    // 4. Create the new site (without blocks initially)
    const newSite = await db.site.create({
      data: {
        name: newName,
        display_name: newDisplayName,
        description: description || originalSite.description,
        logo: originalSite.logo,
        font: originalSite.font,
        image: originalSite.image,
        imageBlurhash: originalSite.imageBlurhash,
        subdomain: newSubdomain,
        customDomain: null, // Explicitly set to null
        message404: originalSite.message404,
        background: originalSite.background,
        user: { connect: { id: userId } }
        // Blocks will be added in the next step
      }
    });

    // 5. Duplicate the blocks for the new site
    if (originalSite.blocks.length > 0) {
      const blocksData = originalSite.blocks.map(block => ({
        type: block.type,
        position: block.position,
        label: block.label,
        href: block.href,
        logo: block.logo,
        style: block.style ?? {}, // Ensure style is not null
        widget: block.widget ?? {}, // Ensure widget is not null
        siteId: newSite.id // Link to the newly created site
      }));

      await db.block.createMany({
        data: blocksData
      });
    }

    // 6. Revalidate tags for the new site
    revalidateTag(
      `${newSite.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );
    // No custom domain to revalidate initially

    // 7. Optional: Add an event log
    after(() => {
      db.event
        .create({
          data: {
            userId: String(userId),
            eventType: 'SITE_DUPLICATED',
            payload: { originalSiteId: siteId, newSite },
            correlationId: nanoid()
          }
        })
        .then(event => {
          console.info('events::duplicateSite', event);
        })
        .catch(error => {
          console.error('events::duplicateSite', error);
        });
    });

    return newSite;
  } catch (error: unknown) {
    console.error('Error duplicating site:', error);
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const assignProspect = async (form: FormData) => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user?.id) {
      return { data: null, error: await translate('auth.error') };
    }

    const userId = user.id;
    const prospectIds = form.getAll('selected[]') as string[]; // Ensure IDs are strings

    console.info('assignProspect', { userId, prospectIds });

    const response = await db.user.updateMany({
      where: { id: { in: prospectIds } },
      data: { refererId: userId }
    });

    after(() => {
      db.event
        .createMany({
          data: [
            ...prospectIds.map(pid => ({
              userId: pid,
              eventType: 'LEAD_ASSIGNED',
              payload: { didBy: userId }
            })),
            {
              userId,
              eventType: 'LEADS_ASSIGNED',
              payload: { leadIds: prospectIds }
            }
          ]
        })
        .then(event => {
          console.info('events::assignProspect', event);
        })
        .catch(error => {
          console.error('events::assignProspect', error);
        });
    });

    return { data: response, error: null };
  } catch (error: unknown) {
    console.error('Error assigning prospects:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      data: null,
      errorMessage,
      error: await translate('error')
    };
  }
};

export const unassignProspect = async (form: FormData) => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user?.id) {
      return { data: null, error: await translate('auth.error') };
    }

    const userId = user.id;
    const prospectIds = form.getAll('selected[]') as string[]; // Ensure IDs are strings
    const reason = String(form.get('reason'));

    console.info('unassignProspect', { userId, prospectIds, reason });

    const response = await db.user.updateMany({
      where: { id: { in: prospectIds } },
      data: { refererId: null }
    });

    after(() => {
      db.event
        .createMany({
          data: [
            ...prospectIds.map(pid => ({
              userId: pid,
              eventType: 'LEAD_UNASSIGNED',
              payload: { didBy: userId, reason }
            })),
            {
              userId,
              eventType: 'LEADS_UNASSIGNED',
              payload: { leadIds: prospectIds }
            }
          ]
        })
        .then(event => {
          console.info('events::unassignProspect', event);
        })
        .catch(error => {
          console.error('events::unassignProspect', error);
        });
    });

    return { data: response, error: null };
  } catch (error: unknown) {
    console.error('Error unassigning prospects:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      data: null,
      errorMessage,
      error: await translate('error')
    };
  }
};

export const bookProspect = async (form: FormData) => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user?.id) {
      return { data: null, error: await translate('auth.error') };
    }

    const userId = user.id;

    const type = String(form.get('type'));
    const day = String(form.get('day'));
    const time = String(form.get('time'));
    const email = String(form.get('email'));
    const name = String(form.get('name'));
    const comment = String(form.get('comment'));
    const timeSlotInterval = Number(form.get('timeSlotInterval'));

    console.log({
      type,
      day,
      time,
      email,
      name,
      comment,
      timeSlotInterval,
      userId
    });

    const response = await db.reservation.create({
      data: {
        type,
        name,
        email,
        comment,
        dateStart: new Date(`${day} ${time}`),
        dateEnd: new Date(
          new Date(`${day} ${time}`).getTime() + timeSlotInterval * 60000
        ),
        affiliateId: userId
      }
    });

    console.log({ response });

    const destination = await db.user.findUniqueOrThrow({
      where: { email }
    });

    console.log({ destination });

    after(() => {
      const correlationId = nanoid();

      db.event
        .createMany({
          data: [
            {
              userId: destination.id,
              eventType: 'RESERVATION_CREATED',
              payload: { didBy: userId, reservation: response },
              correlationId
            },
            {
              userId,
              eventType: 'LEAD_CONTACTED',
              payload: {
                by: 'RESERVATION',
                leadId: destination.id,
                reservation: response
              },
              correlationId
            }
          ]
        })
        .then(event => {
          console.info('events::bookProspect', event);
        })
        .catch(error => {
          console.error('events::bookProspect', error);
        });
    });

    return { data: response, error: null };
  } catch (error: unknown) {
    console.error('Error booking prospect:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      data: null,
      errorMessage,
      error: await translate('error')
    };
  }
};

export const commentProspect = async (form: FormData) => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user?.id) {
      return { data: null, error: await translate('auth.error') };
    }

    const userId = user.id;

    const leadId = String(form.get('userId'));
    const comment = String(form.get('comment'));

    const response = await db.comment.create({
      data: {
        content: comment,
        user: { connect: { id: leadId } }
      }
    });

    console.log({ response });

    after(() => {
      const correlationId = nanoid();

      db.event
        .createMany({
          data: [
            {
              userId: leadId,
              correlationId,
              eventType: 'COMMENT_CREATED',
              payload: {
                didBy: userId,
                comment: response
              }
            },
            {
              userId,
              correlationId,
              eventType: 'LEAD_COMMENTED',
              payload: {
                leadId,
                comment: response
              }
            }
          ]
        })
        .then(event => {
          console.info('events::commentProspect', event);
        })
        .catch(error => {
          console.error('events::commentProspect', error);
        });
    });

    return { data: response, error: null };
  } catch (error: unknown) {
    console.error('Error booking prospect:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      data: null,
      errorMessage,
      error: await translate('error')
    };
  }
};

export const createMagicLink = async ({
  email,
  daysValid = 7,
  callbackUrl = 'http://app.localhost:11000/'
}: {
  email: string;
  daysValid?: number;
  callbackUrl?: string;
}) => {
  try {
  const token = nanoid();
  const secret = process.env.AUTH_SECRET;
  const hash = await createHash(`${token}${secret}`);

  await db.verificationToken.create({
    data: {
      identifier: email,
      token: hash,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * daysValid)
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
  const provider = { id: 'resend' };

  const url = `${baseUrl}/api/auth/callback/${provider.id}?${new URLSearchParams(
    {
      callbackUrl,
      token,
      email
    }
  )}`;

  console.log({ url });

    return { url };
  } catch (error: unknown) {
    console.error('Error creating magic link:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      data: null,
      errorMessage,
      error: await translate('error')
    };
  }
};

};
