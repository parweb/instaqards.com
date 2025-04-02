export const base = process.env?.NEXTAUTH_URL ?? 'https://qards.link';

export const langs = ['fr', 'en', 'it', 'es'] as const;

export type Lang = (typeof langs)[number];
