import { Prisma } from '@prisma/client';
import { ulid } from 'ulid';

import { getLang, sendHtmlWithCampaign } from 'helpers/mail';
import { createMagicLink } from 'lib/actions';
import { Lang } from 'translations';
import { app, base } from '../../emails/layout/settings';

export const link =
  (id: string, { lang }: { lang: Lang }) =>
  (href: string, name: string = '') =>
    `____BASE____/api/email/track/click?url=${encodeURIComponent(String(href))}&id=${id}&name=${encodeURIComponent(name)}&lang=${lang}`;

export const getLinks = (html: string) => {
  const result = [];

  const linkRe =
    /<a\b(?<attrs>(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*>/gi;

  for (const tag of html.matchAll(linkRe)) {
    const attributes: Record<string, string> = {};
    const attrZone = tag.groups?.attrs;

    if (!attrZone) {
      continue;
    }

    const attrRe = /(\w+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

    for (const [, name, dquote, squote, bare] of attrZone.matchAll(attrRe)) {
      attributes[name] = dquote ?? squote ?? bare ?? true; // booléen s’il n’y a pas de valeur
    }

    if (attributes.href !== '') {
      result.push(attributes);
    }
  }

  return [...result].sort((a, b) => b.href.length - a.href.length);
};

export function getVariables(
  html: string,
  { unicode = true, unique = true }: { unicode?: boolean; unique?: boolean } = {
    unicode: true,
    unique: true
  }
) {
  const rx = unicode
    ? /\{(\p{ID_Start}\p{ID_Continue}*(?:\.\p{ID_Start}\p{ID_Continue}*)*)\}/gu
    : /\{([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\}/g;

  const out = [];
  for (const m of html.matchAll(rx)) out.push(m[1]);
  return unique ? [...new Set(out)] : out;
}

export const sendCampaignEmail = async (
  contact: Prisma.UserGetPayload<{
    select: {
      email: true;
      sites: {
        select: {
          id: true;
        };
        orderBy: [{ updatedAt: 'desc' }];
      };
    };
  }>,
  campaign: Prisma.CampaignGetPayload<{
    select: {
      id: true;
      email: {
        select: {
          subject: true;
          content: true;
        };
      };
    };
  }>
) => {
  const id = ulid();
  const lang = await getLang();
  const track = link(id, { lang });
  const pixel = `<img src="${base}/api/email/track/open?id=${encodeURIComponent(id)}" alt="" width="1" height="1" style="display: none;" />`;

  const values: Record<string, string | (() => Promise<string | undefined>)> = {
    magicLink: () =>
      createMagicLink({
        email: contact.email,
        callbackUrl: `${app}/site/${contact.sites?.at(0)?.id}`
      }).then(({ url }) => url),
    ...Object.fromEntries(
      Object.entries(contact)
        .filter(([, value]) => typeof value === 'string')
        .map(([key, value]) => [`user.${key}`, value])
    )
  };

  let html = campaign.email.content;
  const variables = getVariables(html);
  for (const variable of variables) {
    const value = values?.[variable]
      ? typeof values[variable] === 'function'
        ? ((await values[variable]()) ?? `{${variable}}`)
        : values[variable]
      : `{${variable}}`;
    html = html.replaceAll(`{${variable}}`, value);
  }

  const links = getLinks(html);

  for (const link of links) {
    html = html.replaceAll(
      link.href,
      track(
        link.href,
        link?.title ??
          link.href.replaceAll('https://', '').replaceAll('http://', '')
      )
    );
  }

  html = html.replaceAll('____BASE____', base);
  html = html.replace('</body>', pixel + '</body>');

  await sendHtmlWithCampaign(
    id,
    contact.email,
    campaign.email.subject,
    html,
    campaign.id
  );
};
