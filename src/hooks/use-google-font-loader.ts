import { useEffect } from 'react';

export default function useGoogleFontLoader(fontName: string | null) {
  useEffect(() => {
    if (!fontName) return;

    const formattedName = fontName.replace(/\s+/g, '+');
    const linkHref = `https://fonts.googleapis.com/css?family=${formattedName}:wght@400;700&display=swap`;

    const existingLink = document.querySelector(`link[href="${linkHref}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.href = linkHref;
    link.rel = 'stylesheet';
    link.type = 'text/css';

    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fontName]);
}
