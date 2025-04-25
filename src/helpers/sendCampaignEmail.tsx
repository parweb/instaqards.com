import { Prisma, User } from '@prisma/client';
import { ulid } from 'ulid';

import { getLang, sendHtmlWithCampaign } from 'helpers/mail';
import { createMagicLink } from 'lib/actions';
import { Lang } from 'translations';
import { base } from '../../emails/layout/settings';

export const link =
  (id: string, { lang }: { lang: Lang }) =>
  (href: string, name: string = '') =>
    `${base}/api/email/track/click?url=${encodeURIComponent(String(href))}&id=${id}&name=${encodeURIComponent(name)}&lang=${lang}`;

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

  return result;
};

export function getVariables(
  html: string,
  { unicode = true, unique = true }: { unicode?: boolean; unique?: boolean } = {
    unicode: true,
    unique: true
  }
) {
  // ASCII (rapide) ou plein Unicode (plus complet) au choix
  const rx = unicode
    ? /\{(\p{ID_Start}\p{ID_Continue}*(?:\.\p{ID_Start}\p{ID_Continue}*)*)\}/gu
    : /\{([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\}/g;

  const out = [];
  for (const m of html.matchAll(rx)) out.push(m[1]);
  return unique ? [...new Set(out)] : out;
}

export const sendCampaignEmail = async (
  contact: User,
  campaign: Prisma.CampaignGetPayload<{ include: { email: true } }>
) => {
  const id = ulid();
  const lang = await getLang();
  const track = link(id, { lang });
  const pixelUrl = `${base}/api/email/track/open?id=${encodeURIComponent(id)}`;
  const pixel = `<img src="${pixelUrl}" alt="" width="1" height="1" style="display: none;" />`;
  const values: Record<string, string | (() => Promise<string | undefined>)> = {
    magicLink: () =>
      createMagicLink({
        email: contact.email,
        callbackUrl: `${base}/xxxxxx`
      }).then(({ url }) => url),
    ...Object.fromEntries(
      Object.entries(contact)
        .filter(([, value]) => typeof value === 'string')
        .map(([key, value]) => [`user.${key}`, value])
    )
  };

  // 1. Remplacement des variables {variable} par leur valeur réelle
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
  // 2. Tracking des liens (hors mailto, ancres, déjà trackés)
  const links = getLinks(html);
  for (const link of links) {
    html = html.replaceAll(
      link.href,
      track(link.href, link?.title ?? link.href)
    );
  }
  // 3. Ajout du pixel de tracking
  html = html.replace('</body>', pixel + '</body>');
  // console.log('------');
  // process.stdout.write(html);
  // console.log('------');
  await sendHtmlWithCampaign(
    id,
    contact.email,
    campaign.email.subject,
    html,
    campaign.id
  );
};
