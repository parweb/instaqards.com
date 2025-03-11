'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export default function Youtube({
  videoId = 'VCyuZhnm71I'
}: {
  videoId?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to show controls and unmute via YouTube Player API
  const activatePlayer = () => {
    setPlaying(true);

    // Use postMessage to control the YouTube player without reloading
    if (iframeRef.current) {
      // Unmute the player
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute' }),
        '*'
      );

      // Show controls
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo' }),
        '*'
      );
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden">
      <iframe
        ref={iframeRef}
        title="YouTube video player"
        width="100%"
        className="aspect-video"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&enablejsapi=1&showinfo=${playing ? '1' : '0'}&rel=0&iv_load_policy=3`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      {false && !playing && (
        <button
          type="button"
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black transition-opacity hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={activatePlayer}
          aria-label="Activer le son et afficher les contrôles"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Vignette YouTube"
            className="w-full h-full object-cover"
            fill
            priority
          />

          <div className="absolute flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
                style={{ marginLeft: '2px' }}
                aria-hidden="true"
              >
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
