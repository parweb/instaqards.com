import * as z from 'zod';

import { trySafe } from 'helpers/trySafe';
import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Track URL', kind: 'link', just: 'url' }))
});

const placeholder =
  'https://music.apple.com/fr/album/lose-yourself-from-8-mile/1445726870?i=1445727316';

export default function AppleMusic({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    const query = new URL(url);
    return query.origin + query.pathname;
  }, placeholder);

  return (
    <iframe
      title="Soundcloud"
      className="aspect-square w-full rounded-md"
      src={url.replace('music.apple.com', 'embed.music.apple.com')}
      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
      loading="lazy"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
    />
  );
}
