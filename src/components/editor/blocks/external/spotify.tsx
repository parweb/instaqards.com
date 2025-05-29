import { z } from 'zod';

import { json } from 'lib/utils';

const regex =
  /\/(track|album|artist|playlist|show|episode)\/([0-9A-Za-z]+)(?=\?|$)/gm;

export const input = z.object({
  url: z
    .string()
    .regex(regex)
    .describe(json({ label: 'Track/Album URL', kind: 'link', just: 'url' }))
});

export default function Spotify({
  url = 'https://open.spotify.com/intl-fr/album/2cWBwpqMsDJC1ZUwz813lo'
}: Partial<z.infer<typeof input>>) {
  const [uri] = url.match(regex) ?? [];

  // 80px (all)
  // 152px (all)
  // 232px (track, show, episode)
  // 352px (all)
  // > 352px fluid (album, artist, playlist)

  return (
    <iframe
      className="!flex-none"
      title="Spotify"
      style={{ borderRadius: '6px' }}
      src={`https://open.spotify.com/embed/${uri}`}
      width="100%"
      height="352px"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
