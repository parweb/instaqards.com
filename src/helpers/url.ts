import { nanoid } from 'nanoid';

export const clean = (text: string) => {
  const url = text.replace(/\/$/, '');

  if (url.includes(':')) {
    return url;
  }

  return `https://${url}`;
};

export const shorten = (url: string, length = 8): string => nanoid(length);
