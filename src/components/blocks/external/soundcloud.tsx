import * as z from 'zod';

export const input = z.object({
  url: z.string().url().describe('Album URL')
});

export default function Soundcloud({
  url = 'https://soundcloud.com/defcraig/hasta-siempre-x-waves-wav-def-craig-baptiste-caffrey-afroboot1'
}: Partial<z.infer<typeof input>>) {
  const albumId = url.split('/').pop();

  return (
    <iframe
      title="Soundcloud"
      style={{ borderRadius: '12px' }}
      src={`https://w.soundcloud.com/player/?url=${url}&color=%233c2020&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
      width="100%"
      height="300"
      allow="autoplay"
      loading="lazy"
    />
  );
}
