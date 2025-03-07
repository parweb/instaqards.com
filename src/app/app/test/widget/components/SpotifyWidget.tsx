'use client';

export const SpotifyWidget = ({ albumId }: { albumId: string }) => {
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
};
