import * as z from 'zod';

import { json } from 'lib/utils';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Track/Album URL', kind: 'string' }))
});

export default function Spotify({
  url = 'https://open.spotify.com/intl-fr/album/2cWBwpqMsDJC1ZUwz813lo'
}: Partial<z.infer<typeof input>>) {
  const uri = url.split('/').slice(-2).join('/');

  return (
    <iframe
      title="Spotify"
      style={{ borderRadius: '12px' }}
      src={`https://open.spotify.com/embed/${uri}`}
      width="100%"
      height="352"
      frameBorder="0"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
