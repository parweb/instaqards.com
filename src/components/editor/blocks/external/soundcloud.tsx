import * as z from 'zod';

import { json } from 'lib/utils';
import { trySafe } from 'helpers/trySafe';

export const input = z.object({
  url: z
    .string()
    .url()
    .describe(json({ label: 'Track URL', kind: 'link', just: 'url' }))
});

const placeholder =
  'https://soundcloud.com/defcraig/hasta-siempre-x-waves-wav-def-craig-baptiste-caffrey-afroboot1';

export default function Soundcloud({
  url = placeholder
}: Partial<z.infer<typeof input>>) {
  [, url] = trySafe(() => {
    const query = new URL(url);
    return query.origin + query.pathname;
  }, placeholder);

  return (
    <iframe
      title="Soundcloud"
      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%233c2020&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
      width="100%"
      className="w-full aspect-square rounded-md"
      allow="autoplay"
      loading="lazy"
    />
  );
}
