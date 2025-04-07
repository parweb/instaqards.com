export const app = process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000';
// export const app = 'https://app.qards.link';
export const base = app.replace('app.', '');

export const langs = ['fr', 'en', 'it', 'es'] as const;

export type Lang = (typeof langs)[number];
