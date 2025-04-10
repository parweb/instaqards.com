'use server';

import { UserRole, type Block, type Link, type Site } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { z } from 'zod';

import { db } from 'helpers/db';
import { sendOutboxEmail } from 'helpers/mail';
import { put } from 'helpers/storage';
import { translate } from 'helpers/translate';
import { shorten } from 'helpers/url';
import { getSession, withSiteAuth } from 'lib/auth';
import { getBlurDataURL } from 'lib/utils';

import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex
} from 'lib/domains';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
);

export const createSite = async (
  formData: FormData
): Promise<{ error: string } | Site> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: await translate('auth.error') };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const subdomain = String(formData.get('subdomain'))
    .toLowerCase()
    .trim()
    .replace(/[\W_]+/g, '-');

  try {
    const response = await db.site.create({
      data: {
        name,
        description,
        subdomain,
        user: { connect: { id: session.user.id } },
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

// generic function to try catch any function
const trySafe = async <T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<[boolean, T, unknown]> => {
  try {
    return [true, await fn(), null];
  } catch (error: unknown) {
    return [false, defaultValue, error];
  }
};

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

export const editUser = async (
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
    db.event.create({
      data: {
        userId: String(session.user.id),
        eventType: 'USER_CREATED',
        payload: response,
        correlationId: nanoid()
      }
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
