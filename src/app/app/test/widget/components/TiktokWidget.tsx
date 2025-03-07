'use client';

export const TiktokWidget = ({ postId }: { postId: string }) => {
  return (
    <>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@lemecencostard/video/${postId}`}
        data-video-id={postId}
        style={{ maxWidth: '100%' }}
      >
        <section />
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js" />
    </>
  );
};
