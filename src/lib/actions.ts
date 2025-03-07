'use server';

import type { Block, Site } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { revalidateTag } from 'next/cache';

import { db } from 'helpers';
import { put } from 'helpers/storage';
import { translate } from 'helpers/translate';
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
    return { error: translate('auth.error') };
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
        display_name: name,
        description,
        subdomain,
        user: { connect: { id: session.user.id } }
      }
    });

    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
    );

    return response;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error && 'code' in error && error.code === 'P2002'
          ? translate('lib.actions.domain.taken')
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred'
    };
  }
};

export const updateBlock = withSiteAuth<Block>(async (formData, _, blockId) => {
  if (!blockId) {
    return { error: 'Block ID is required' };
  }

  const label = formData.get('label') as Block['label'];
  const href = formData.get('href') as Block['href'];
  const logo = formData.get('logo') as Block['logo'];
  const style = JSON.parse(String(formData.get('style') ?? '{}'));

  try {
    const response = await db.block.update({
      include: { site: true },
      where: { id: blockId },
      data: {
        label,
        href,
        logo: logo || null,
        style
      }
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
  formData: FormData,
  site: Site['id'],
  type: Block['type']
): Promise<{ error: string } | Block> => {
  const label = formData.get('label') as Block['label'];
  const href = formData.get('href') as Block['href'];
  const logo = formData.get('logo') as Block['logo'];
  const style = JSON.parse(String(formData.get('style') ?? '{}'));

  try {
    const response = await db.block.create({
      include: { site: true },
      data: {
        type,
        label,
        href,
        logo: logo || null,
        site: { connect: { id: site } },
        style
      }
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
  if (!key) {
    return { error: translate('lib.actions.update-site.error') };
  }

  const value = formData.get(key) as string;

  try {
    let response: Site = site;

    if (key === 'customDomain') {
      if (value.includes('vercel.pub')) {
        return { error: translate('lib.actions.vercel.domain.error') };
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
          ? translate('lib.actions.update-site.error')
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

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string
) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: translate('auth.error') };
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
          ? translate('lib.actions.edit-user.error')
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred'
    };
  }
};
