import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Track URL', kind: 'string' }))
});

export default function AppleMusic({
  url = 'https://music.apple.com/fr/album/lose-yourself-from-8-mile/1445726870?i=1445727316'
}: Partial<z.infer<typeof input>>) {
  return (
    <iframe
      title="Soundcloud"
      style={{ borderRadius: '12px' }}
      src={url.replace('music.apple.com', 'embed.music.apple.com')}
      width="100%"
      height="175"
      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
      loading="lazy"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
    />
  );
}
