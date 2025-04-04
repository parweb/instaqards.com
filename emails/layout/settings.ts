export const base = process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000';

export const langs = ['fr', 'en', 'it', 'es'] as const;

export type Lang = (typeof langs)[number];
