import * as z from 'zod';

const input = z.object({
  url: z.string().url().optional().describe('Album URL')
});

export default function Spotify({
  url = 'https://open.spotify.com/intl-fr/album/2cWBwpqMsDJC1ZUwz813lo'
}: z.infer<typeof input>) {
  const albumId = url.split('/').pop();

  return (
    <iframe
      title="Spotify"
      style={{ borderRadius: '12px' }}
      src={`https://open.spotify.com/embed/album/${albumId}`}
      width="100%"
      height="352"
      frameBorder="0"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
